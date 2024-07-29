import crypto from 'crypto';

const encryptToken = (
  data: string,
  key: string
): { iv: string; encryptedData: string; authTag: string } => {
  const keyBuffer = Buffer.from(key, 'hex');
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Uint8Array.from(keyBuffer),
    Uint8Array.from(iv)
  );

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  console.log({
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag
  });

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag
  };
};

const decryptToken = (
  encryptedData: string,
  iv: string,
  authTag: string,
  key: string
): string => {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Uint8Array.from(keyBuffer),
    Uint8Array.from(ivBuffer)
  );
  decipher.setAuthTag(Uint8Array.from(authTagBuffer));

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

export { encryptToken, decryptToken };
