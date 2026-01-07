import { Injectable } from '@nestjs/common';
import { constants, createCipheriv, createDecipheriv, privateEncrypt, publicDecrypt, randomBytes } from 'crypto';
import { ApiErrorException } from '../../common/exceptions/api-error.exception';
import { KeysService } from '../../common/crypto/keys.service';


@Injectable()
export class EncryptDataService {
    constructor(private readonly keysService: KeysService) { }
    async encrypt(payload: string): Promise<{ data1: string; data2: string }> {
        const MAX_PAYLOAD_CHARS = 2000;
        try {
            if (payload.length > MAX_PAYLOAD_CHARS) {
                throw new ApiErrorException('VALIDATION_ERROR');
            }
            const privateKey = this.keysService.getPrivateKey();

            //Generate AES key (32 bytes => AES-256)
            const aesKey = randomBytes(32);

            //Encrypt payload with AES-256-GCM
            const iv = randomBytes(12);
            const cipher = createCipheriv('aes-256-gcm', aesKey, iv);

            const ciphertext = Buffer.concat([
                cipher.update(payload, 'utf8'),
                cipher.final(),
            ]);
            const tag = cipher.getAuthTag(); // 16 bytes

            //base64( iv + tag + ciphertext )
            const data2 = Buffer.concat([iv, tag, ciphertext]).toString('base64');

            //Encrypt AES key with PRIVATE key
            const encryptedAesKey = privateEncrypt(
                {
                    key: privateKey,
                    padding: constants.RSA_PKCS1_PADDING,
                },
                aesKey,
            );
            const data1 = encryptedAesKey.toString('base64');

            return { data1, data2 };
        } catch (e) {
            if (e instanceof ApiErrorException) throw e;
            throw new ApiErrorException('ENCRYPT_ERROR');
        }
    }
    async decrypt(data1: string, data2: string): Promise<{ payload: string }> {
        try {
            const publicKey = this.keysService.getPublicKey();

            // Decrypt AES key with PUBLIC key
            const aesKey = publicDecrypt(
                {
                    key: publicKey,
                    padding: constants.RSA_PKCS1_PADDING,
                },
                Buffer.from(data1, 'base64'),
            );

            // Parse data2 = base64(iv + tag + ciphertext)
            const raw = Buffer.from(data2, 'base64');

            const iv = raw.subarray(0, 12);
            const tag = raw.subarray(12, 28); // 16 bytes
            const ciphertext = raw.subarray(28);

            //Decrypt payload with AES-256-GCM
            const decipher = createDecipheriv('aes-256-gcm', aesKey, iv);
            decipher.setAuthTag(tag);

            const plaintext = Buffer.concat([
                decipher.update(ciphertext),
                decipher.final(),
            ]).toString('utf8');

            return { payload: plaintext };
        } catch (e) {
            throw new ApiErrorException('DECRYPT_ERROR');
        }
    }
}