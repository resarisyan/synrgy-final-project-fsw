"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toQrResponse = toQrResponse;
function toQrResponse(qr) {
    return {
        transaction_id: qr.transaction_id,
        expired_at: qr.expired_at,
        payload: qr.payload,
        updated_at: qr.updated_at,
        type: qr.type,
        used: qr.used,
        user: qr.user
    };
}
//# sourceMappingURL=qr-response.js.map