import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Headers,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { createResponse, decodedToken } from 'src/ultis/config';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/dangKy')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/dangNhap')
  login(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser);
  }

  @Get('/LayDanhSachLoaiNguoiDung')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/LayDanhSachNguoiDung')
  getNguoiDung() {
    return this.userService.getNguoiDung();
  }

  @Get('/LayDanhSachNguoiDungPhanTrang')
  @ApiQuery({ name: 'tuKhoa', required: false, type: 'string' })
  @ApiQuery({ name: 'soTrang', required: false, type: 'number' })
  @ApiQuery({ name: 'soPhanTuTranTrang', required: false, type: 'number' })
  getNguoiDungPhanTrang(@Query() param: GetUserDto) {
    return this.userService.getNguoiDungPhanTrang(param);
  }

  @Get('/TimKiemNguoiDung')
  @ApiQuery({ name: 'tuKhoa', required: false, type: 'string' })
  getTimKiemNguoiDung(@Query() param: GetUserDto) {
    return this.userService.getTimKiemNguoiDung(param);
  }

  @Get('/TimKiemNguoiDungPhanTrang')
  @ApiQuery({ name: 'tuKhoa', required: false, type: 'string' })
  @ApiQuery({ name: 'soTrang', required: false, type: 'number' })
  @ApiQuery({ name: 'soPhanTuTranTrang', required: false, type: 'number' })
  getTimKiemNguoiDungPhanTrang(@Query() param: GetUserDto) {
    return this.userService.getTimKiemNguoiDungPhanTrang(param);
  }

  @ApiHeader({ name: 'Authorization', required: true })
  @Post('/LayThongTinNguoiDung')
  getInfoUser(
    @Req() req: Request,
    @Headers('Authorization') authorizationToken: string,
  ) {
    return this.userService.getInfoUser(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/CapNhatThongTinNguoiDung')
  async updateInfo(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    let token = (req.headers as any).authorization;

    token = token.slice(7, token.length);
    const userInfo = await decodedToken(token);

    if (userInfo.loai_nguoi_dung !== 'admin') {
      return createResponse(
        400,
        'Unauthorized',
        'Chỉ có admin mới có thể update !',
      );
    }
    return await this.userService.updateInfo(updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('/XoaNguoiDung')
  async xoaNguoiDung(@Req() req: Request, @Query('id') id: number) {
    let token = (req.headers as any).authorization;

    token = token.slice(7, token.length);
    const userInfo = await decodedToken(token);

    if (userInfo.loai_nguoi_dung !== 'admin') {
      return createResponse(
        400,
        'Unauthorized',
        'Chỉ có admin mới có thể update !',
      );
    }
    return await this.userService.xoaNguoiDung(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
