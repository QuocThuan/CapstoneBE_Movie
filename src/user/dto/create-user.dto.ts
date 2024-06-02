import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  taiKhoan: string;

  @ApiProperty()
  matKhau: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  soDt: string;

  @ApiProperty()
  maNhom: string;

  @ApiProperty()
  hoTen: string;
}
