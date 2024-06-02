import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  matKhau: string;

  @ApiProperty()
  email: string;
}
