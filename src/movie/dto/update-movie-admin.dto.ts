import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhimDto {
  @ApiProperty()
  ten_phim: string;

  @ApiProperty()
  trailer: string;

  @ApiProperty()
  hinh_anh: string;

  @ApiProperty()
  mo_ta: string;

  @ApiProperty()
  ngay_khoi_chieu: Date;

  @ApiProperty()
  danh_gia: number;

  @ApiProperty()
  hot: boolean;

  @ApiProperty()
  dang_chieu: boolean;

  @ApiProperty()
  sap_chieu: boolean;
}
