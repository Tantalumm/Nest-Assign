import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength } from 'class-validator';

export class EncryptRequestDto {
    @ApiProperty({
        type: String,
        required: true,
        description: '0 - 2000 characters',
        example: 'hello',
        maxLength: 2000,
    })
    @IsDefined()
    @IsString()
    @MaxLength(2000)
    payload!: string;
}