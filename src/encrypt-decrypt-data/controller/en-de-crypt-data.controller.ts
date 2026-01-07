import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { EncryptDataService } from '../service/en-de-crypt-data.service';
import { EncryptRequestDto } from '../dto/encrypt-data.request.dto';
import { EncryptResponseDto } from '../dto/encrypt-data.response.dto';
import { DecryptRequestDto } from '../dto/decrypt-data.request.dto';
import { DecryptResponseDto } from '../dto/decrypt-data.response.dto';
import { ok } from '../../common/types/api-response';

@ApiTags('encrypt-data')
@Controller()
export class EncryptDataController {
    constructor(private readonly encryptDataService: EncryptDataService) { }

    @Post('/get-encrypt-data')
    @ApiOkResponse({ type: EncryptResponseDto })
    @ApiBadRequestResponse({ description: 'VALIDATION_ERROR'})
    async getEncryptData(@Body() body: EncryptRequestDto): Promise<EncryptResponseDto> {
        const data = await this.encryptDataService.encrypt(body.payload);
        return ok(data) as any;
    }
    @Post('/get-decrypt-data')
    @ApiOkResponse({ type: DecryptResponseDto })
    @ApiBadRequestResponse({ description: 'VALIDATION_ERROR'})
    async getDecryptData(@Body() body: DecryptRequestDto): Promise<DecryptResponseDto> {
        const data = await this.encryptDataService.decrypt(body.data1, body.data2);
        return ok(data) as any;
    }
}


