import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchMovieDto {
  @IsOptional()
  @IsString()
  tenPhim: string;

  @IsOptional()
  @IsString()
  maPhim: string;

  @IsOptional()
  @IsNumber()
  soTrang: number;

  @IsOptional()
  @IsNumber()
  soPhanTuTranTrang: number;

  @IsOptional()
  @IsString()
  tuNgay: string;

  @IsOptional()
  @IsString()
  denNgay: string;
}
