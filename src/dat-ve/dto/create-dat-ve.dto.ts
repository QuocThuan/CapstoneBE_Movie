import { ApiProperty } from '@nestjs/swagger';

export class CreateDatVeDto {
  @ApiProperty()
  maPhim: number;

  @ApiProperty()
  ngayChieuGioChieu: string;

  @ApiProperty()
  maRap: number;

  @ApiProperty()
  giaVe: number;
}
