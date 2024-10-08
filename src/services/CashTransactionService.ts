import { EnumMutationType } from '../enums/mutation-type-enum';
import { EnumTransactionType } from '../enums/transaction-type-enum';
import { ResponseError } from '../handlers/response-error';
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
  CashTransactionHistoryResponse,
  toCashTransactionResponse,
  toCashTransactionHistoryResponse
} from '../dtos/response/cash-transaction-response';
import { v4 as uuidv4 } from 'uuid';
import { MutationModel } from '../models/MutationModel';

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

    if (createRequest.type === EnumCashTransaction.TOPUP) {
      createRequest.amount = 0;
    }

    if (createRequest.type === EnumCashTransaction.WITHDRAW) {
      if (createRequest.amount < 50000 || createRequest.amount % 50000 !== 0) {
        throw new ResponseError(
          400,
          'Withdraw amount must be a multiple of 50000'
        );
      } else if (createRequest.amount > 5000000) {
        throw new ResponseError(
          400,
          'Withdraw amount must be less than Rp5.000.000'
        );
      } else if (createRequest.amount > request.user.balance) {
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

    const token = req.token;
    const userId = await CashTransactionModel.query()
      .findOne({ code: token })
      .select('user_id');

    const userID = JSON.parse(JSON.stringify(userId)).user_id;

    const user = await UserModel.query()
      .findById(userID)
      .forUpdate()
      .throwIfNotFound();
    const cashTransaction = await CashTransactionModel.query()
      .where({
        user_id: userID,
        code: storeRequest.token
      })
      .first()
      .throwIfNotFound();

    if (cashTransaction.type !== storeRequest.type) {
      throw new ResponseError(400, 'Token type is not match');
    } else if (cashTransaction.is_success) {
      throw new ResponseError(400, 'Token has already been taken');
    } else if (cashTransaction.expired_at <= new Date(Date.now())) {
      throw new ResponseError(400, 'Token has already expired');
    }

    const isWithdraw = storeRequest.type === EnumCashTransaction.WITHDRAW;
    const isTopup = storeRequest.type === EnumCashTransaction.TOPUP;

    if (isWithdraw && Number(user.balance) < Number(cashTransaction.amount)) {
      throw new ResponseError(400, 'Balance is not enough to withdraw');
    }

    const result = await UserModel.transaction(async (trx) => {
      let transactionAmount = cashTransaction.amount;

      if (isTopup) {
        if (storeRequest.amount < 50000 || storeRequest.amount % 50000 !== 0) {
          throw new ResponseError(
            400,
            'Topup amount must be a multiple of 50000'
          );
        } else if (storeRequest.amount > 5000000) {
          throw new ResponseError(
            400,
            'Topup amount must be less than Rp5.000.000'
          );
        } else {
          await cashTransaction.$query(trx).patch({
            amount: storeRequest.amount
          });
          transactionAmount = storeRequest.amount;
        }
      }

      const newBalance = isWithdraw
        ? Number(user.balance) - Number(transactionAmount)
        : Number(user.balance) + Number(transactionAmount);

      await user.$query(trx).patch({ balance: newBalance });

      await MutationModel.query(trx).insert({
        id: uuidv4(),
        amount: transactionAmount,
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
  ): Promise<CashTransactionHistoryResponse[]> {
    const data = CashTransactionModel.query()
      .where('user_id', request.user.id)
      .where('is_success', true)
      .orderBy('created_at', 'desc');

    if (request.createdAtStart && request.createdAtEnd) {
      data.whereBetween('created_at', [
        request.createdAtStart.toISOString(),
        request.createdAtEnd.toISOString()
      ]);
    }
    const result = await data;

    if (result.length === 0) {
      throw new ResponseError(404, 'Data not found');
    }

    return result.map(toCashTransactionHistoryResponse);
  }
}
