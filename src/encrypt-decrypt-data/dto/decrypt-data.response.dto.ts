import { ApiProperty } from '@nestjs/swagger';

export class DecryptDataDto {
    @ApiProperty({ example: 'hello' })
    payload!: string;
}

export class DecryptResponseDto {
    @ApiProperty({ example: true })
    successful!: boolean;

    @ApiProperty({ example: '' })
    error_code!: string;

    @ApiProperty({ type: () => DecryptResponseDto, nullable: true })
    data!: DecryptResponseDto | null;
}