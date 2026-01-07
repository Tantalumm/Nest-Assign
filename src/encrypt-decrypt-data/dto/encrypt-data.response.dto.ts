import { ApiProperty } from '@nestjs/swagger';

export class EncryptDataDto {
    @ApiProperty({ example: 'encrypted-aes-key' })
    data1!: string;

    @ApiProperty({ example: 'encrypted-payload' })
    data2!: string;
}

export class EncryptResponseDto {
    @ApiProperty({ example: true })
    successful!: boolean;

    @ApiProperty({ example: '' })
    error_code!: string;

    @ApiProperty({ type: () => EncryptDataDto, nullable: true })
    data!: EncryptDataDto | null;
}