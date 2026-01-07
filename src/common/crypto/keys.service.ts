import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Console } from 'console';

@Injectable()
export class KeysService {
  constructor(private readonly config: ConfigService) {}

  getPrivateKey(): string {
    const key = this.config.get<string>('crypto.rsaPrivateKey');
    if (!key) throw new Error('Missing RSA private key (crypto.rsaPrivateKey)');
    return key;
  }

  getPublicKey(): string {
    const key = this.config.get<string>('crypto.rsaPublicKey');
    if (!key) throw new Error('Missing RSA public key (crypto.rsaPublicKey)');
    return key;
  }
}