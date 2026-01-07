import { Module } from '@nestjs/common';
import { CryptoModule } from '../common/crypto/crypto.module';
import {EncryptDataService} from './service/en-de-crypt-data.service';
import {EncryptDataController} from './controller/en-de-crypt-data.controller';

@Module({
  imports: [CryptoModule],
  controllers: [EncryptDataController],
  providers: [EncryptDataService],
})

export class EncryptDataModule {}
