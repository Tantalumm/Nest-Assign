import { registerAs } from '@nestjs/config';

function normalizePemKey(value: string): string {
  return value.replace(/\\n/g, '\n').trim();
}

export default registerAs('crypto', () => ({
  rsaPrivateKey: normalizePemKey(process.env.RSA_PRIVATE_KEY ?? ''),
  rsaPublicKey: normalizePemKey(process.env.RSA_PUBLIC_KEY ?? ''),
}));