import { Page } from 'objection';
import { MutationModel } from '../models/MutattionModel';
import { Validation } from '../validators';

import { ResponseError } from '../handlers/response-error';
import { User } from '../models/UserModel';
import { GetMutationRequest } from '../dtos/request/mutation-request';
import { MutationValidation } from '../validators/mutation-validation';
import { MutationResponse } from '../dtos/response/mutation-response';
import { convertHTMLToPDF } from '../helpers/pdf';

export class MutationService {
  static async getAll(
    req: GetMutationRequest,
    user: User
  ): Promise<Page<MutationModel>> {
    const request = Validation.validate(MutationValidation.GetMutation, req);
    const query = MutationModel.query()
      .withGraphFetched('[user, account]')
      .where('user_id', user.id)
      .orWhere('account_number', user.account_number)
      .orderBy('created_at', 'desc');

    if (request.category) {
      query.where('mutation_type', request.category);
    }

    if (request.dateRange && request.dateRange.start && request.dateRange.end) {
      query.whereBetween('created_at', [
        request.dateRange.start,
        request.dateRange.end
      ]);
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
      mutation?.user_id !== user.id ||
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

  static async generatePdf(mutation: MutationResponse): Promise<void> {
    const html = `
     <div style="padding: 24px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="position: relative;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              <img src="/images/logo.png" alt="Logo" style="width: 48px; height: 48px; margin-right: 8px;" />
              <h6 style="margin: 0;">Rupi App</h6>
            </div>
          </div>

          <!-- Status -->
          <p style="text-align: center; margin-top: 8px; font-size: 14px;">${mutation.transaction_purpose}</p>
          <hr style="margin: 16px 0;" />

          <!-- Recipient Details -->
          <div style="margin-bottom: 16px;">
            <p style="margin: 0; font-weight: bold;">Penerima</p>
            < style="margin: 0;">${mutation.recipientName}</p>
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

    await convertHTMLToPDF(html, 'mutation.pdf');
  }
}
