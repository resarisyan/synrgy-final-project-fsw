import { Page } from 'objection';
import { Validation } from '../validators';

import { ResponseError } from '../handlers/response-error';
import { User } from '../models/UserModel';
import {
  EstatementRequest,
  GetMutationRequest
} from '../dtos/request/mutation-request';
import { MutationValidation } from '../validators/mutation-validation';
import { MutationResponse } from '../dtos/response/mutation-response';
import { EnumMutationType } from '../enums/mutation-type-enum';
import { EnumTransactionType } from '../enums/transaction-type-enum';
import { MutationModel } from '../models/MutationModel';
import { EnumFile } from '../enums/enum-file';
import { convertHTMLToDocument } from '../helpers/pdf';

export class MutationService {
  static async getAll(
    req: GetMutationRequest,
    user: User
  ): Promise<Page<MutationModel>> {
    const request = Validation.validate(MutationValidation.GetMutation, req);
    const query = MutationModel.query()
      .withGraphFetched('[user, account]')
      .where(function () {
        this.where('user_id', user.id).orWhere(
          'account_number',
          user.account_number
        );
      })
      .orderBy('created_at', 'desc');

    if (request.category) {
      query.where('transaction_type', request.category);
    }

    if (request.mutationType) {
      query.where('mutation_type', request.mutationType);
    }

    if (request.transactionType) {
      query.where('transaction_type', request.transactionType);
    }

    if (request.dateRange && request.dateRange.start && request.dateRange.end) {
      const startDate = new Date(request.dateRange.start).toISOString();
      const endDate = new Date(request.dateRange.end).toISOString();
      console.log(`Filtering between ${startDate} and ${endDate}`);

      query.whereBetween('created_at', [startDate, endDate]);
    }

    const mutations = await query.page(request.page - 1, request.size);

    if (mutations.results.length === 0) {
      throw new ResponseError(404, 'Data not found');
    }

    return mutations;
  }

  static async getOne(id: string, user: User): Promise<MutationResponse> {
    const mutation = await MutationModel.query()
      .withGraphFetched('[user, account]')
      .findById(id);

    if (!mutation) {
      throw new ResponseError(404, 'Data not found');
    }

    if (
      mutation?.user_id !== user.id &&
      mutation?.account_number !== user.account_number
    ) {
      throw new ResponseError(403, 'Forbidden');
    }

    return {
      id: mutation.id,
      amount: mutation.amount,
      description: mutation.description,
      mutation_type: mutation.mutation_type,
      recipientName:
        mutation.transaction_type === 'DEBIT'
          ? mutation.user.full_name
          : mutation.full_name,
      senderAccountNumber:
        mutation.transaction_type === 'DEBIT'
          ? mutation.account_number.slice(0, 4)
          : mutation.user.account_number.slice(0, 4),
      recipientAccountNumber:
        mutation.transaction_type === 'DEBIT'
          ? mutation.user.account_number
          : mutation.account_number,
      senderName:
        mutation.transaction_type === 'DEBIT'
          ? mutation.full_name
          : mutation.user.full_name,
      transaction_purpose: mutation.transaction_purpose,
      transaction_type: mutation.transaction_type,
      created_at: mutation.created_at,
      updated_at: mutation.updated_at
    };
  }

  static async generateDocument(
    mutation: MutationResponse,
    pdfFilePath: string,
    outputType: EnumFile
  ): Promise<Uint8Array> {
    const html = `
     <div style="padding: 24px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="position: relative;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              <img src="https://res.cloudinary.com/dpe64ddng/image/upload/v1724230750/hfohsrakgztfxwfyne20.png" alt="Logo" style="width: 48px; height: 48px;" />
              <h2 style="margin: 0;">Rupi App</h2>
            </div>
          </div>

          <!-- Status -->
          <p style="text-align: center; margin-top: 8px; font-size: 14px;">${mutation.transaction_purpose}</p>
          <hr style="margin: 16px 0;" />

          <!-- Recipient Details -->
          <div style="margin-bottom: 16px;">
            <p style="margin: 0; font-weight: bold;">Penerima</p>
            <p style="margin: 0;">${mutation.recipientName}</p>
            <p style="margin: 0; color: #6c757d;">Bank Central Asia - ${mutation.recipientAccountNumber}</p>
          </div>
          <hr style="margin: 16px 0;" />

          <!-- Transfer Details -->
          <div style="margin-bottom: 16px;">
            <p style="margin: 0; font-weight: bold;">Rincian Transfer</p>
            <div style="display: flex; justify-content: space-between;">
              <p style="margin: 0;">Nominal Transfer</p>
              <p style="margin: 0;">${mutation.amount}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p style="margin: 0;">Metode Transfer</p>
              <p style="margin: 0;">${mutation.transaction_type}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p style="margin: 0;">Biaya Transfer</p>
              <p style="margin: 0;">0</p>
            </div>
            <hr style="margin: 16px 0;" />
            <div style="display: flex; justify-content: space-between;">
              <p style="margin: 0;">Total Transaksi</p>
              <p style="margin: 0;">${mutation.amount}</p>
            </div>
            <hr style="margin: 16px 0;" />
          </div>

          <!-- Sender Details -->
          <div style="margin-bottom: 16px;">
            <p style="margin: 0; font-weight: bold;">Rekening Sumber</p>
            <p style="margin: 0;">${mutation.senderName}</p>
            <p style="margin: 0; color: #6c757d;">
              Bank Central Asia - <span>&bull; &bull; &bull; &bull;</span> ${mutation.senderAccountNumber}
            </p>
          </div>
          </div>`;

    return await convertHTMLToDocument(html, pdfFilePath, outputType);
  }

  static async generateEStatement(
    req: EstatementRequest,
    user: User,
    pdfFilePath: string
  ): Promise<Uint8Array> {
    const request = Validation.validate(MutationValidation.Estatement, req);
    const startDate = new Date(request.dateRange.start);
    const endDate = new Date(request.dateRange.end);
    // const mutations = await MutationModel.query()
    //   .withGraphFetched('[user, account]')
    // .where('user_id', '0554ece0-c60f-4118-a61f-a8787d4e5ad9')
    //   .where('user_id', user.id)
    // .where('account_number', user.account_number)
    // .andWhere('mutation_type', EnumMutationType.TRANSFER)
    // .andWhere('transaction_type', EnumTransactionType.CREDIT)
    //   .whereBetween('created_at', [startDate, endDate])
    //   .orderBy('created_at', 'desc');

    const mutations = await MutationModel.query()
      .withGraphFetched('[user, account]')
      .where(function () {
        this.where('user_id', user.id).orWhere(
          'account_number',
          user.account_number
        );
      })
      .whereBetween('created_at', [startDate, endDate])
      .orderBy('created_at', 'desc');

    if (mutations.length === 0) {
      throw new ResponseError(404, 'Data not found');
    }

    // Define the types for grouped mutations
    type GroupedMutations = {
      [key in EnumMutationType]?: MutationModel[];
    };

    // Initialize the grouped mutations with the proper type
    const groupedMutations: GroupedMutations = mutations.reduce(
      (acc, mutation) => {
        const type = mutation.mutation_type as EnumMutationType;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type]!.push(mutation);
        return acc;
      },
      {} as GroupedMutations
    );

    let html = `
  <div style="padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); font-family: 'Helvetica Neue', Arial, sans-serif; color: #333;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
      <div style="display: flex; align-items: center;">
        <img src="https://res.cloudinary.com/dpe64ddng/image/upload/v1724230750/hfohsrakgztfxwfyne20.png" alt="Bank Logo" style="width: 64px; height: 64px; margin-right: 16px;" />
        <h1 style="margin: 0; font-size: 28px; color: #0044cc;">Rupi Bank</h1>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-size: 14px; color: #888;">${new Date().toLocaleDateString()}</p>
        <p style="margin: 0; font-size: 14px; color: #888;">Account Number: ${user.account_number}</p>
      </div>
    </div>
    <h2 style="font-size: 24px; color: #0044cc; margin-bottom: 24px; border-bottom: 2px solid #0044cc; padding-bottom: 8px;">E-Statement</h2>`;

    let grandTotal = 0;

    for (const [mutationType, items] of Object.entries(groupedMutations) as [
      EnumMutationType,
      MutationModel[]
    ][]) {
      let totalCredit = 0;
      let totalDebit = 0;

      html += `
    <div style="margin-bottom: 32px; padding: 16px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #f9f9f9;">
      <h3 style="font-size: 18px; margin-bottom: 16px; color: #0044cc;">${mutationType}</h3>`;

      for (const item of items) {
        html += `
      <div style="margin-bottom: 16px;">
        <p style="font-size: 16px; margin-bottom: 4px; color: #333;">${item.description}</p>
        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666;">
          <span>${new Date(item.created_at).toLocaleDateString()}</span>
          <span>${item.transaction_type === EnumTransactionType.DEBIT ? '-' : '+'}${item.amount.toLocaleString()}</span>
        </div>
      </div>`;

        if (item.transaction_type === EnumTransactionType.DEBIT) {
          totalDebit += item.amount;
          grandTotal -= item.amount; // Subtract debit from grand total
        } else {
          totalCredit += item.amount;
          grandTotal += item.amount; // Add credit to grand total
        }
      }

      html += `
    <div style="border-top: 1px solid #ddd; margin-top: 16px; padding-top: 16px;">
      <p style="font-weight: bold; font-size: 16px; color: #333;">Total ${mutationType}</p>
      <p style="font-size: 16px; color: ${totalCredit > totalDebit ? '#00cc44' : '#cc0000'};">${grandTotal.toLocaleString()}</p>
    </div>
  </div>`;
    }

    html += `</div>`;
    return await convertHTMLToDocument(html, pdfFilePath);
  }
}
