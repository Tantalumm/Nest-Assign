import { Module } from '@nestjs/common';
import { EncryptDataModule } from './encrypt-decrypt-data/en-de-crypt-data.module';
import cryptoConfig from './config/crypto.config';
import { envValidationSchema } from './config/env.validation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cryptoConfig],
      validationSchema: envValidationSchema,
    }),
    EncryptDataModule
  ],
})
export class AppModule { }
