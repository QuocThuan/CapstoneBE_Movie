import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';

class VeDto {
  @ApiProperty()
  @IsNumber()
  nguoi_dung_id: number;

  @ApiProperty()
  @IsNumber()
  maGhe: number;
}

export class GetDatVeDto {
  @IsOptional()
  @IsNumber()
  maLichChieu: number;

  @ApiProperty({ type: [VeDto] })
  danhSachVe: VeDto[];
}
