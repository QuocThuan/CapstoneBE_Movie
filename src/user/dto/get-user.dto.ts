import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  @IsString()
  tuKhoa: string;

  @IsOptional()
  @IsNumber()
  soTrang: number;

  @IsOptional()
  @IsNumber()
  soPhanTuTranTrang: number;
}
