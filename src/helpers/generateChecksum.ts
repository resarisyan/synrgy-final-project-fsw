import checksum from 'checksum';

export async function generateChecksum(data: string) {
  const hash = checksum(data).toUpperCase();
  return hash.substring(0, 4);
}
