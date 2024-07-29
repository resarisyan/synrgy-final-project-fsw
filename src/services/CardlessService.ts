import BigNumber from 'bignumber.js';
import {
  DemoDepositRequest,
  DemoWithdrawRequest
} from '../dtos/request/transaction-request';
import {
  toTransactionResponse,
  TransactionResponse
} from '../dtos/response/transaction-response';
import { EnumCardlessTransaction } from '../enums/cash-transaction-enum';
import { EnumMutationType } from '../enums/mutation-type-enum';
import { EnumTransactionType } from '../enums/transaction-type-enum';
import { ResponseError } from '../handlers/response-error';
import { CardlessTransactionModel } from '../models/CardlessTransactionModel';
import { MutationModel } from '../models/MutattionModel';
import { UserModel } from '../models/UserModel';
import { Validation } from '../validators';
import {
  DemoDeposit,
  DemoWithdraw
} from '../validators/transaction-validation';

export class CardlessService {
  static async demoWithdraw(
    req: DemoWithdrawRequest
  ): Promise<TransactionResponse> {
    const transactionRequest = Validation.validate(DemoWithdraw.WD, req);
    const account = await UserModel.query()
      .findById(req.user_id)
      .throwIfNotFound();

    const checkTransaction = await CardlessTransactionModel.query()
      .where({
        user_id: transactionRequest.user_id
      })
      .first()
      .throwIfNotFound();

    // isTokenUsed
    const isTokenUsed = checkTransaction.status;
    if (isTokenUsed) {
      throw new ResponseError(500, 'Token sudah digunakan');
    }

    if (transactionRequest.access_at >= checkTransaction.expired_at) {
      //   pengecekan expired
      throw new ResponseError(500, 'Token telah expired');
    }

    // pengecekan type token withdraw
    if (transactionRequest.token != checkTransaction.token) {
      throw new ResponseError(400, 'Token salah');
    }

    // pengecekan pin
    if (transactionRequest.pin != account.pin) {
      throw new ResponseError(400, 'Pin salah, mohon coba kembali');
    }

    // patch status to true
    await CardlessTransactionModel.transaction(async (trx) => {
      await CardlessTransactionModel.query(trx)
        .patch({
          status: true,
          updated_at: new Date(Date.now()),
          type: EnumCardlessTransaction.WITHDRAW
        })
        .where({
          user_id: req.user_id
        });
    });

    // set user saldo
    const setBalance = account.balance - checkTransaction.amount;
    await UserModel.transaction(async (trx) => {
      await UserModel.query(trx)
        .patch({
          balance: setBalance
        })
        .where({ id: req.user_id });
    });

    // make mutations
    const result = await MutationModel.transaction(async (trx) => {
      const wdTransaction = await MutationModel.query(trx).insert({
        amount: checkTransaction.amount,
        type: EnumMutationType.WITHDRAW,
        description: 'Tarik Tunai',
        account_number: account.account_number,
        user_id: account.id,
        transaction: EnumTransactionType.DEBIT
      });

      await MutationModel.query(trx).insert({
        amount: checkTransaction.amount,
        type: EnumMutationType.WITHDRAW,
        description: 'Tarik Tunai',
        account_number: account.account_number,
        user_id: account.id,
        transaction: EnumTransactionType.DEBIT
      });

      return wdTransaction;
    });

    // ubah status ke true pada tabel cardless_transactions
    return toTransactionResponse(result);
  }

  static async demoDeposit(
    req: DemoDepositRequest
  ): Promise<TransactionResponse> {
    console.log(req);
    const transactionRequest = Validation.validate(DemoDeposit.DEPO, req);
    const account = await UserModel.query()
      .findById(req.user_id)
      .throwIfNotFound();

    const checkTransaction = await CardlessTransactionModel.query()
      .where({
        user_id: transactionRequest.user_id
      })
      .first()
      .throwIfNotFound();

    if (checkTransaction.status) {
      throw new ResponseError(500, 'Token sudah digunakan');
    }

    if (transactionRequest.access_at >= checkTransaction.expired_at) {
      //   pengecekan expired
      throw new ResponseError(500, 'Token telah expired');
    }
    // pengecekan type token withdraw
    if (transactionRequest.token != checkTransaction.token) {
      throw new ResponseError(400, 'Token salah');
    }
    // pengecekan pin
    if (transactionRequest.pin != account.pin) {
      throw new ResponseError(400, 'Pin salah, mohon coba kembali');
    }

    // patch status to true
    await CardlessTransactionModel.transaction(async (trx) => {
      await CardlessTransactionModel.query(trx)
        .patch({
          amount: transactionRequest.amount,
          status: true,
          updated_at: new Date(Date.now()),
          type: EnumCardlessTransaction.DEPOSIT
        })
        .where({
          user_id: req.user_id
        });
    });

    // set user saldo
    const setBalance = new BigNumber(account.balance).plus(
      transactionRequest.amount
    );
    console.log(setBalance);
    console.log(account.balance);
    console.log(transactionRequest.amount);

    await UserModel.transaction(async (trx) => {
      await UserModel.query(trx)
        .patch({
          balance: setBalance.toNumber()
        })
        .where({ id: req.user_id });
    });

    // make mutations
    const result = await MutationModel.transaction(async (trx) => {
      const depoTransaction = await MutationModel.query(trx).insert({
        amount: transactionRequest.amount,
        type: EnumMutationType.TOPUP,
        description: 'Setor Tunai',
        account_number: account.account_number,
        user_id: account.id,
        transaction: EnumTransactionType.CREDIT
      });

      await MutationModel.query(trx).insert({
        amount: transactionRequest.amount,
        type: EnumMutationType.TOPUP,
        description: 'Setor Tunai',
        account_number: account.account_number,
        user_id: account.id,
        transaction: EnumTransactionType.CREDIT
      });

      return depoTransaction;
    });

    // ubah status ke true pada tabel cardless_transactions
    return toTransactionResponse(result);
  }
}
