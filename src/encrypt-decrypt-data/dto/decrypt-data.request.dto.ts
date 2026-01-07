import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class DecryptRequestDto {
  @ApiProperty({ type: String, required: true, example: 'base64' })
  @IsDefined()
  @IsString()
  data1!: string;

  @ApiProperty({ type: String, required: true, example: 'base64' })
  @IsDefined()
  @IsString()
  data2!: string;
}