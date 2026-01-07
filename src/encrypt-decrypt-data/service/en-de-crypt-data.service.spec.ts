import { Test, TestingModule } from '@nestjs/testing';
import { EncryptDataService } from './en-de-crypt-data.service';

import { generateKeyPairSync } from 'crypto';
import { KeysService } from '../../common/crypto/keys.service';

describe('EncryptDataService', () => {
  let encryptDataService: EncryptDataService;

  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptDataService,
        {
          provide: KeysService,
          useValue: {
            getPrivateKey: () => privateKey,
            getPublicKey: () => publicKey,
          },
        },
      ],
    }).compile();

    encryptDataService = module.get(EncryptDataService);
  });

  it('should encrypt and decrypt back to the same payload (roundtrip)', async () => {
    const payload = 'hello nestjs';

    const { data1, data2 } = await encryptDataService.encrypt(payload);

    expect(typeof data1).toBe('string');
    expect(typeof data2).toBe('string');
    expect(data1.length).toBeGreaterThan(0);
    expect(data2.length).toBeGreaterThan(0);

    const result = await encryptDataService.decrypt(data1, data2);
    expect(result.payload).toBe(payload);
  });

  it('should allow empty payload (0 characters)', async () => {
    const payload = '';

    const { data1, data2 } = await encryptDataService.encrypt(payload);
    const result = await encryptDataService.decrypt(data1, data2);

    expect(result.payload).toBe('');
  });

  it('should allow payload == 2000 characters)', async () => {
    const payload = 'A'.repeat(2000);

    const { data1, data2 } = await encryptDataService.encrypt(payload);
    const result = await encryptDataService.decrypt(data1, data2);

    expect(result.payload).toBe(payload);
  });

  it('should error payload > 2000 characters', async () => {
    const payload = 'A'.repeat(2001);

    await expect(encryptDataService.encrypt(payload)).rejects.toMatchObject({
      response: { error_code: 'VALIDATION_ERROR' },
    });
  });

  it('should throw DECRYPT_ERROR when data2 is tampered', async () => {
    const payload = 'secret';
    const { data1, data2 } = await encryptDataService.encrypt(payload);

    const tampered = data2.slice(0, -2) + 'AA';

    await expect(encryptDataService.decrypt(data1, tampered)).rejects.toMatchObject({
      response: { error_code: 'DECRYPT_ERROR' },
    });
  });

  it('should throw DECRYPT_ERROR when data1 is invalid', async () => {
    const payload = 'secret';
    const { data2 } = await encryptDataService.encrypt(payload);

    const invalidData1 = 'not-base64!!!';

    await expect(encryptDataService.decrypt(invalidData1, data2)).rejects.toMatchObject({
      response: { error_code: 'DECRYPT_ERROR' },
    });
  });

  it('should throw ENCRYPT_ERROR if private key is missing', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptDataService,
        {
          provide: KeysService,
          useValue: {
            getPrivateKey: () => '', // ทำให้พัง
            getPublicKey: () => publicKey,
          },
        },
      ],
    }).compile();

    const brokenService = module.get(EncryptDataService);

    await expect(brokenService.encrypt('x')).rejects.toMatchObject({
      response: { error_code: 'ENCRYPT_ERROR' },
    });
  });
});
