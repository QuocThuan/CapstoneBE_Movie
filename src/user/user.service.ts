import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { createResponse, decodedToken } from 'src/ultis/config';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from './dto/get-user.dto';
import { contains } from 'class-validator';
import { Request } from 'express';

const prisma = new PrismaClient();
@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      let { taiKhoan, matKhau, email, soDt, maNhom, hoTen } = createUserDto;

      let checkEmail = await prisma.nguoiDung.findMany({
        where: {
          email,
        },
      });

      // kiểm tra email trùng
      if (checkEmail.length > 0) {
        // thông báo email tồn tại
        return 'Email đã tồn tại';
      }

      await prisma.nguoiDung.create({
        data: {
          tai_khoan: taiKhoan,
          mat_khau: bcrypt.hashSync(matKhau, 10),
          email,
          ho_ten: hoTen,
          so_dt: soDt,
          loai_nguoi_dung: maNhom,
        },
      });

      return createResponse(200, 'Đăng ký thành công', '');
    } catch (err) {
      console.log(err);
      createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', err);
    }
  }

  async login(loginUser: LoginUserDto) {
    try {
      let { matKhau, email } = loginUser;

      let checkEmail = await prisma.nguoiDung.findFirst({
        where: {
          email,
        },
      });

      if (checkEmail) {
        if (bcrypt.compareSync(matKhau, checkEmail.mat_khau)) {
          let key = new Date().getTime();

          let token = await this.jwtService.signAsync(
            {
              nguoi_dung_id: checkEmail.nguoi_dung_id,
              ho_Ten: checkEmail.ho_ten,
              loai_nguoi_dung: checkEmail.loai_nguoi_dung,
              key,
            },
            {
              expiresIn: '3d',
              secret: 'BI_MAT',
            },
          );

          return createResponse(200, 'Login thành công', token);
        }

        return createResponse(400, 'Mật khẩu không đúng', '');
      }

      return createResponse(400, 'Email không đúng', '');
    } catch (err) {
      console.log(err);
      createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', err);
    }
  }

  findAll() {
    try {
      const data = [
        {
          maLoaiNguoiDung: 'admin',
          tenLoai: 'admin',
        },
        {
          maLoaiNguoiDung: 'users',
          tenLoai: 'users',
        },
      ];
      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getNguoiDung() {
    try {
      let data = await prisma.nguoiDung.findMany({
        where: {
          da_xoa: false,
        },
      });
      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getNguoiDungPhanTrang(param: GetUserDto) {
    try {
      let { soTrang, soPhanTuTranTrang } = param;

      let data = await prisma.nguoiDung.findMany({
        where: {
          da_xoa: false,
        },
      });

      let start = (Number(soTrang) - 1) * Number(soPhanTuTranTrang);
      let end = start + Number(soPhanTuTranTrang);

      let content = data.slice(start, end);

      return createResponse(200, 'Xử lý thành công', content);
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getTimKiemNguoiDung(param: GetUserDto) {
    try {
      let { tuKhoa } = param;

      let tenNguoiDung = {};
      if (tuKhoa) {
        tenNguoiDung = {
          ho_ten: {
            contains: tuKhoa,
          },
          da_xoa: false,
        };
      }

      let data = await prisma.nguoiDung.findMany({
        where: tenNguoiDung,
      });

      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getTimKiemNguoiDungPhanTrang(param: GetUserDto) {
    try {
      let { soTrang, soPhanTuTranTrang, tuKhoa } = param;

      let tenNguoiDung = {};
      if (tuKhoa) {
        tenNguoiDung = {
          ho_ten: {
            contains: tuKhoa,
          },
          da_xoa: false,
        };
      }

      let data = await prisma.nguoiDung.findMany({
        where: tenNguoiDung,
      });

      let start = (Number(soTrang) - 1) * Number(soPhanTuTranTrang);
      let end = start + Number(soPhanTuTranTrang);

      let content = data.slice(start, end);

      console.log(data);

      return createResponse(200, 'Xử lý thành công', content);
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getInfoUser(req: any) {
    try {
      let token = req.headers.authorization;

      token = token.slice(7, token.length);
      let { nguoi_dung_id } = decodedToken(token);
      const data = await prisma.nguoiDung.findUnique({
        where: {
          nguoi_dung_id: nguoi_dung_id,
        },
      });

      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async xoaNguoiDung(id: number) {
    try {
      let data = await prisma.nguoiDung.findFirst({
        where: {
          nguoi_dung_id: id,
        },
      });
      if (!data) {
        return createResponse(
          400,
          'Không tìm thấy tài nguyên',
          'Mã phim không tồn tại',
        );
      }
      await prisma.nguoiDung.update({
        where: {
          nguoi_dung_id: id,
        },
        data: {
          da_xoa: true,
        },
      });

      return createResponse(
        200,
        'Xử lý thành công',
        'Đã xóa người dùng thành công',
      );
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async updateInfo(updateUserDto: UpdateUserDto) {
    try {
      console.log(updateUserDto);
      let { email, hoTen, soDt, maNhom, matKhau, taiKhoan } = updateUserDto;

      let data = await prisma.nguoiDung.findFirst({
        where: {
          email: email,
        },
      });

      if (!data) {
        return createResponse(
          400,
          'Xử lý không thành công',
          'Người dùng không tồn tại',
        );
      }

      await prisma.nguoiDung.update({
        where: {
          nguoi_dung_id: data.nguoi_dung_id,
        },
        data: {
          tai_khoan: taiKhoan,
          email: email,
          mat_khau: matKhau,
          ho_ten: hoTen,
          loai_nguoi_dung: maNhom,
          so_dt: soDt,
        },
      });

      return createResponse(
        200,
        'Xử lý thành công',
        'Đã cập nhật người dùng thành công',
      );
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
