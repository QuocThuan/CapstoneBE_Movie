import { Injectable } from '@nestjs/common';
import { CreateDatVeDto } from './dto/create-dat-ve.dto';
import { UpdateDatVeDto } from './dto/update-dat-ve.dto';
import { GetDatVeDto } from './dto/get-dat-ve.dto';
import { createResponse } from 'src/ultis/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class DatVeService {
  async create(createDatVeDto: CreateDatVeDto) {
    try {
      let { maPhim, maRap, giaVe, ngayChieuGioChieu } = createDatVeDto;
      let data = await prisma.lichChieu.create({
        data: {
          ma_phim: maPhim,
          ma_rap: maRap,
          gia_ve: giaVe,
          ngay_gio_chieu: new Date(ngayChieuGioChieu),
        },
      });
      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async datVe(datVe: GetDatVeDto) {
    try {
      let { maLichChieu, danhSachVe } = datVe;

      let promise = await danhSachVe.map(async (ve) => {
        let datVe = await prisma.datVe.create({
          data: {
            ma_lich_chieu: maLichChieu,

            ma_ghe: ve.maGhe,
            nguoi_dung_id: ve.nguoi_dung_id,
          },
        });
        return datVe;
      });

      const bookedTickets = await Promise.all(promise);

      console.log(bookedTickets);

      return createResponse(200, 'Xử lý thành công', bookedTickets);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getPhongVe(param: GetDatVeDto) {
    try {
      let { maLichChieu } = param;
      let data = await prisma.lichChieu.findMany({
        where: {
          ma_lich_chieu: Number(maLichChieu),
        },
        include: {
          rapPhim: true,
          phim: true,
        },
      });
      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} datVe`;
  }

  update(id: number, updateDatVeDto: UpdateDatVeDto) {
    return `This action updates a #${id} datVe`;
  }

  remove(id: number) {
    return `This action removes a #${id} datVe`;
  }
}
