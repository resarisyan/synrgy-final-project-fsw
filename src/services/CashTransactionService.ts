import { EnumMutationType } from '../enums/mutation-type-enum';
import { EnumTransactionType } from '../enums/transaction-type-enum';
import { ResponseError } from '../handlers/response-error';
import { MutationModel } from '../models/MutattionModel';
import { UserModel } from '../models/UserModel';
import { Validation } from '../validators';
import { randomTokenGenerate } from '../helpers/randomTokenGenerate';
import { EnumCashTransaction } from '../enums/cash-transaction-enum';
import { CashTransactionModel } from '../models/CashTransactionModel';
import { CashTransactionValidation } from '../validators/cash-transaction-validation';
import {
  CashTransactionCreateRequest,
  CashTransactionStoreRequest,
  CashTransactionHistoryRequest
} from '../dtos/request/cash-transaction-request';
import { EnumTransactionPurpose } from '../enums/transaction-purpose-enum';
import {
  CashTransactionResponse,
  toCashTransactionResponse
} from '../dtos/response/cash-transaction-response';
import { v4 as uuidv4 } from 'uuid';

export class CashTransactionService {
  static async create(
    request: CashTransactionCreateRequest
  ): Promise<CashTransactionResponse> {
    const token = randomTokenGenerate();
    const currentTime = new Date(Date.now());
    const oneHourLater = new Date(currentTime.getTime() + 3600000);

    const createRequest = Validation.validate(
      CashTransactionValidation.CREATE,
      request
    );

    if (createRequest.type === EnumCashTransaction.WITHDRAW) {
      if (createRequest.amount < 50000 || createRequest.amount % 50000 !== 0) {
        throw new ResponseError(
          400,
          'Nominal harus kelipatan 50.000 dan minimal 50.000'
        );
      }

      if (createRequest.amount > request.user.balance) {
        throw new ResponseError(400, 'Saldo tidak mencukupi');
      }
    }

    const data = await CashTransactionModel.query().insert({
      user_id: request.user.id,
      amount: createRequest.amount,
      expired_at: oneHourLater,
      type: createRequest.type,
      code: token,
      is_success: false,
      created_at: currentTime,
      updated_at: currentTime
    });

    return toCashTransactionResponse(data);
  }

  static async store(
    req: CashTransactionStoreRequest
  ): Promise<CashTransactionResponse> {
    const storeRequest = Validation.validate(
      CashTransactionValidation.STORE,
      req
    );

    const user = await UserModel.query()
      .findById(req.user.id)
      .forUpdate()
      .throwIfNotFound();
    const cashTransaction = await CashTransactionModel.query()
      .where({
        user_id: req.user.id,
        code: storeRequest.token
      })
      .first()
      .throwIfNotFound();

    if (cashTransaction.is_success) {
      throw new ResponseError(500, 'Token sudah digunakan');
    } else if (cashTransaction.expired_at <= new Date(Date.now())) {
      throw new ResponseError(500, 'Token telah expired');
    }

    const isWithdraw = storeRequest.type === EnumCashTransaction.WITHDRAW;

    if (isWithdraw && Number(user.balance) < Number(cashTransaction.amount)) {
      throw new ResponseError(
        400,
        'Saldo tidak mencukupi untuk melakukan penarikan'
      );
    }

    const result = await UserModel.transaction(async (trx) => {
      const newBalance = isWithdraw
        ? Number(user.balance) - Number(cashTransaction.amount)
        : Number(user.balance) + Number(cashTransaction.amount);

      await user.$query(trx).patch({ balance: newBalance });

      await MutationModel.query(trx).insert({
        id: uuidv4(),
        amount: cashTransaction.amount,
        mutation_type: EnumMutationType.TRANSFER,
        description: isWithdraw ? 'Withdraw' : 'Topup',
        account_number: user.account_number,
        user_id: user.id,
        full_name: user.full_name,
        transaction_purpose: EnumTransactionPurpose.OTHER,
        transaction_type: isWithdraw
          ? EnumTransactionType.DEBIT
          : EnumTransactionType.CREDIT,
        created_at: new Date(Date.now())
      });

      await cashTransaction.$query(trx).patch({
        is_success: true,
        updated_at: new Date(Date.now())
      });

      return cashTransaction;
    });

    return toCashTransactionResponse(result);
  }

  static async getAllTransactions(
    request: CashTransactionHistoryRequest
  ): Promise<CashTransactionResponse[]> {
    const data = CashTransactionModel.query()
      .where('user_id', request.user.id)
      .where('is_success', true)
      .orderBy('created_at', 'desc');

    if (request.expiredAtStart && request.expiredAtEnd) {
      data.whereBetween('expired_at', [
        request.expiredAtStart.toISOString(),
        request.expiredAtEnd.toISOString()
      ]);
    }
    if ((await data).length === 0) {
      throw new ResponseError(404, 'Data tidak ditemukan');
    }

    return (await data).map(toCashTransactionResponse);
  }
}
