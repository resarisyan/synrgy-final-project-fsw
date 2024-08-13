import bcrypt from 'bcryptjs';

export async function checkPin(encryptedPin: string, pin: string) {
  try {
    const result = await bcrypt.compare(pin, encryptedPin);
    return result;
  } catch (e) {
    return e;
  }
}
