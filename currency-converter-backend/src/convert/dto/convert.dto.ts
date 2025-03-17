import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ConvertDto {
  @IsString()
  @IsNotEmpty()
  source_currency: string;

  @IsString()
  @IsNotEmpty()
  target_currency: string;

  @IsNumber()
  amount: number;
}
