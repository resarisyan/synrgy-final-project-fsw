import BigNumber from 'bignumber.js';
import {
  DemoDepositRequest,
  DemoWithdrawRequest,
  TransactionCardlessRequest
} from '../dtos/request/transaction-request';
import {
  toTransactionResponse,
  TransactionResponse,
  TokenResponse
} from '../dtos/response/transaction-response';
import { EnumCardlessTransaction } from '../enums/cash-transaction-enum';
import { EnumMutationType } from '../enums/mutation-type-enum';
import { EnumTransactionType } from '../enums/transaction-type-enum';
import { EnumCardlessType } from '../enums/cardless-type-enum';
import { ResponseError } from '../handlers/response-error';
import { CardlessTransactionModel } from '../models/CardlessTransactionModel';
import { MutationModel } from '../models/MutattionModel';
import { UserModel } from '../models/UserModel';
import { Validation } from '../validators';
import {
  DemoDeposit,
  DemoWithdraw,
  GenerateToken
} from '../validators/transaction-validation';
import { decryptToken, encryptToken } from '../helpers/tokenEncryption';
import { randomTokenGenerate } from '../helpers/randomTokenGenerate';

export class CardlessService {
  static async tokenGenerate(
    req: TransactionCardlessRequest
  ): Promise<TokenResponse> {
    const userID = req.user_id;
    const type = req.type;
    const tokenName = req.token_name;
    const amount = req.amount;

    const token = randomTokenGenerate();

    try {
      const tokenGenerateRequest = Validation.validate(GenerateToken.GT, req);
      const encryptedToken = encryptToken(token, process.env.TOKEN_SECRET_KEY!);
      const account = await UserModel.query()
        .findById(userID)
        .throwIfNotFound();

      if (tokenGenerateRequest.pin !== account.pin) {
        throw new ResponseError(400, 'Pin salah, mohon coba kembali');
      } else if (type === EnumCardlessType.WITHDRAW) {
        if (amount < 50000) {
          throw new ResponseError(
            400,
            'Nominal Tarik Tunai minimal IDR 50.000'
          );
        } else if (amount % 50000 !== 0) {
          throw new ResponseError(
            400,
            'Nominal Tarik Tunai di ATM adalah kelipatan IDR 50.000'
          );
        } else if (amount > account.balance) {
          throw new ResponseError(400, 'Nominal melebihi saldo yang ada');
        } else {
          await CardlessTransactionModel.query().insert({
            user_id: userID,
            token_name: tokenName,
            amount: amount,
            expired_at: new Date(Date.now() + 3600000),
            token: JSON.stringify(encryptedToken),
            status: false,
            type: EnumCardlessTransaction.WITHDRAW,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now())
          });
        }
      } else if (type === EnumCardlessType.DEPOSIT) {
        await CardlessTransactionModel.query().insert({
          user_id: userID,
          token_name: 'Deposit',
          amount: 0,
          expired_at: new Date(Date.now() + 3600000),
          token: JSON.stringify(encryptedToken),
          status: false,
          type: EnumCardlessTransaction.DEPOSIT,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now())
        });
      }

      return {
        token: token,
        expired_at: new Date(Date.now() + 3600000)
      };
    } catch (Err) {
      console.log(Err);
      throw new ResponseError(500, 'Failed to generate Token');
    }
  }

  static async demoWithdraw(
    req: DemoWithdrawRequest
  ): Promise<TransactionResponse> {
    const transactionRequest = Validation.validate(DemoWithdraw.WD, req);

    const account = await UserModel.query()
      .findById(req.user_id)
      .throwIfNotFound();

    const checkTransaction = await CardlessTransactionModel.query()
      .where({
        user_id: transactionRequest.user_id,
        status: false,
        is_expired: false,
        type: EnumCardlessTransaction.WITHDRAW
      })
      .first()
      .throwIfNotFound();

    const tokenString = checkTransaction.token;
    const TOKEN = JSON.parse(JSON.stringify(tokenString));

    const DECRYPTTOKEN = decryptToken(
      TOKEN.encryptedData,
      TOKEN.iv,
      TOKEN.authTag,
      process.env.TOKEN_SECRET_KEY!
    );

    // isTokenUsed
    const isTokenUsed = checkTransaction.status;
    if (isTokenUsed) {
      throw new ResponseError(500, 'Token sudah digunakan');
    }

    //   pengecekan expired
    if (transactionRequest.access_at >= checkTransaction.expired_at) {
      throw new ResponseError(500, 'Token telah expired');
    }

    // pengecekan type token withdraw
    if (transactionRequest.token != DECRYPTTOKEN) {
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
          updated_at: new Date(Date.now())
          // type: EnumCardlessTransaction.WITHDRAW
        })
        .findById(checkTransaction.id);
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
        full_name: account.full_name,
        amount: checkTransaction.amount,
        type: EnumMutationType.WITHDRAW,
        description: 'Tarik Tunai',
        account_number: account.account_number,
        user_id: account.id,
        transaction: EnumTransactionType.DEBIT
      });

      await MutationModel.query(trx).insert({
        full_name: account.full_name,
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
        user_id: transactionRequest.user_id,
        status: false,
        is_expired: false,
        type: EnumCardlessTransaction.DEPOSIT
      })
      .first()
      .throwIfNotFound();

    const tokenObject = checkTransaction.token;
    const TOKEN = JSON.parse(JSON.stringify(tokenObject));

    const DECRYPTTOKEN = decryptToken(
      TOKEN.encryptedData,
      TOKEN.iv,
      TOKEN.authTag,
      process.env.TOKEN_SECRET_KEY!
    );

    // isTokenUsed
    const isTokenUsed = checkTransaction.status;
    if (isTokenUsed) {
      throw new ResponseError(500, 'Token sudah digunakan');
    }

    //   pengecekan expired
    if (transactionRequest.access_at >= checkTransaction.expired_at) {
      throw new ResponseError(500, 'Token telah expired');
    }

    // pengecekan type token withdraw
    if (transactionRequest.token != DECRYPTTOKEN) {
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
          updated_at: new Date(Date.now())
          // type: EnumCardlessTransaction.DEPOSIT
        })
        .findById(checkTransaction.id);
    });

    // set user saldo
    const setBalance = new BigNumber(account.balance).plus(
      transactionRequest.amount
    );

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
        full_name: account.full_name,
        amount: transactionRequest.amount,
        type: EnumMutationType.TOPUP,
        description: 'Setor Tunai',
        account_number: account.account_number,
        user_id: account.id,
        transaction: EnumTransactionType.CREDIT
      });

      await MutationModel.query(trx).insert({
        full_name: account.full_name,
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
