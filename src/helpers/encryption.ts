import crypto from 'crypto';

const encryptData = (data: string, key: string): string => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    key,
    process.env.QR_IV_KEY!
  );
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decryptData = (data: string, key: string): string => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    process.env.QR_IV_KEY!
  );
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export { encryptData, decryptData };
