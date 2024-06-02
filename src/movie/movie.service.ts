import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaClient } from '@prisma/client';
import { createResponse } from 'src/ultis/config';
import { SearchMovieDto } from './dto/search-movie.dto';
import { UpdatePhimDto } from './dto/update-movie-admin.dto';

const prisma = new PrismaClient();

@Injectable()
export class MovieService {
  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  async findAll() {
    try {
      let data = await prisma.banner.findMany();
      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getPhim() {
    try {
      let data = await prisma.phim.findMany({
        where: {
          da_xoa: false,
        },
      });
      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getThongTinPhim(param: SearchMovieDto) {
    try {
      let { maPhim } = param;
      let data = await prisma.phim.findUnique({
        where: {
          ma_phim: Number(maPhim),
        },
      });
      console.log(data);
      if (!data || data.da_xoa === true) {
        return createResponse(
          400,
          'Không tìm thấy tài nguyên',
          'Mã phim không tồn tại',
        );
      }

      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getPhimPhanTrang(param: SearchMovieDto) {
    try {
      let { soTrang, soPhanTuTranTrang } = param;

      let data = await prisma.phim.findMany({
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

  async getPhimTheoNgay(param: SearchMovieDto) {
    try {
      let { soTrang, soPhanTuTranTrang, tuNgay, denNgay, tenPhim } = param;

      const tenPhimLowerCase = tenPhim ? tenPhim.toLowerCase() : '';

      let data = await prisma.phim.findMany({
        where: {
          AND: [
            {
              ten_phim: {
                contains: tenPhimLowerCase,
              },
              da_xoa: false,
            },
            tuNgay ? { ngay_khoi_chieu: { gte: new Date(tuNgay) } } : {},
            denNgay ? { ngay_khoi_chieu: { lte: new Date(denNgay) } } : {},
          ],
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

  async capNhatPhimUpload(maPhim: number, updatePhimDto: UpdatePhimDto) {
    try {
      let data = await prisma.phim.findFirst({
        where: {
          ma_phim: maPhim,
        },
      });
      if (!data) {
        return createResponse(
          400,
          'Không tìm thấy tài nguyên',
          'Mã phim không tồn tại',
        );
      }
      const content = await prisma.phim.update({
        where: {
          ma_phim: maPhim,
        },
        data: {
          ten_phim: updatePhimDto.ten_phim,
          trailer: updatePhimDto.trailer,
          hinh_anh: updatePhimDto.hinh_anh,
          mo_ta: updatePhimDto.mo_ta,
          ngay_khoi_chieu: updatePhimDto.ngay_khoi_chieu,
          danh_gia: updatePhimDto.danh_gia,
          hot: updatePhimDto.hot,
          dang_chieu: updatePhimDto.dang_chieu,
          sap_chieu: updatePhimDto.sap_chieu,
        },
      });
      return createResponse(200, 'Xử lý thành công', content);
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async xoaPhim(maPhim: number) {
    try {
      let data = await prisma.phim.findFirst({
        where: {
          ma_phim: maPhim,
        },
      });
      if (!data) {
        return createResponse(
          400,
          'Không tìm thấy tài nguyên',
          'Mã phim không tồn tại',
        );
      }
      await prisma.phim.update({
        where: {
          ma_phim: maPhim,
        },
        data: {
          da_xoa: true,
        },
      });

      return createResponse(200, 'Xử lý thành công', 'Đã xóa phim thành công');
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async quanLyPhim(file: Express.Multer.File, tenPhim: string) {
    try {
      if (!file || !tenPhim) {
        return createResponse(400, 'Thiếu file hoặc tên phim', '');
      }
      console.log(file);
      console.log(tenPhim);

      if (file?.size > 1 * 1024 * 1024) {
        return 'Dung lượng file không được vượt quá 1MB';
      }
      const allowedImageFormats = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];
      if (!allowedImageFormats.includes(file?.mimetype)) {
        return createResponse(400, 'File không phải là hình ảnh', '');
      }

      const content = await prisma.phim.create({
        data: {
          ten_phim: tenPhim,
          hinh_anh: file.path,
        },
      });
      return createResponse(200, 'Xử lý thành công', content);
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
