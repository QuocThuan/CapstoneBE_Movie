import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetRapDto {
  @IsOptional()
  @IsNumber()
  maHeThongRap: number;

  @IsOptional()
  @IsNumber()
  maPhim: number;
}
