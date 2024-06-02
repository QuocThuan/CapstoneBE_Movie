import { Injectable } from '@nestjs/common';
import { CreateRapDto } from './dto/create-rap.dto';
import { UpdateRapDto } from './dto/update-rap.dto';
import { PrismaClient } from '@prisma/client';
import { GetRapDto } from './dto/get-rap.dto';
import { createResponse } from 'src/ultis/config';

const prisma = new PrismaClient();

@Injectable()
export class RapService {
  // create(createRapDto: CreateRapDto) {
  //   return 'This action adds a new rap';
  // }

  async findAll(param: GetRapDto) {
    try {
      let { maHeThongRap } = param;
      let queryConditions = {};
      if (maHeThongRap) {
        queryConditions = {
          ma_he_thong_rap: Number(maHeThongRap),
        };
      }
      let data = await prisma.heThongRap.findMany({
        where: queryConditions,
      });
      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getCumRap(param: GetRapDto) {
    try {
      let { maHeThongRap } = param;
      let queryConditions = {};
      if (maHeThongRap) {
        queryConditions = {
          ma_he_thong_rap: Number(maHeThongRap),
        };
      }
      let data = await prisma.cumRap.findMany({
        where: queryConditions,
        include: {
          rapPhim: true,
        },
      });
      return createResponse(200, 'Xử lý thành công', data);
    } catch (error) {
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getLichChieu(param: GetRapDto) {
    try {
      let { maHeThongRap } = param;
      let queryConditions = {};
      if (maHeThongRap) {
        queryConditions = {
          ma_he_thong_rap: Number(maHeThongRap),
        };
      }
      let data = await prisma.heThongRap.findMany({
        where: queryConditions,
        include: {
          cumRap: {
            include: {
              rapPhim: {
                include: {
                  lichChieu: {
                    include: {
                      phim: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const content = data.map((heThongRap) => ({
        maHeThongRap: heThongRap.ma_he_thong_rap,
        tenHeThong: heThongRap.ten_he_thong_rap,
        logo: heThongRap.logo,
        listCumRap: [
          heThongRap.cumRap.map((cumRap) => ({
            tenCumRap: cumRap.ten_cum_rap,
            diaChi: cumRap.dia_chi,
            maCumRap: cumRap.ma_cum_rap,
            listPhimChieu: [
              cumRap.rapPhim.map((item) => ({
                maPhim: item.lichChieu[0]?.phim.ma_phim,
                tenPhim: item.lichChieu[0]?.phim.ten_phim,
                hinhAnh: item.lichChieu[0]?.phim.hinh_anh,
                hot: item.lichChieu[0]?.phim.hot,
                dangChieu: item.lichChieu[0]?.phim.dang_chieu,
                sapChieu: item.lichChieu[0]?.phim.sap_chieu,
                danhGia: item.lichChieu[0]?.phim.danh_gia,
                lichChieuCuaPhim: [
                  item.lichChieu.map((lichChieuPhim) => ({
                    maLichChieu: lichChieuPhim.ma_lich_chieu,
                    maRap: lichChieuPhim.ma_rap,
                    tenRap: item.ten_rap,
                    ngayChieuGioChieu: lichChieuPhim.ngay_gio_chieu,
                    giaVe: lichChieuPhim.gia_ve,
                  })),
                ],
              })),
            ],
          })),
        ],
      }));

      return createResponse(200, 'Xử lý thành công', content);
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
  }

  async getLichChieuByPhim(param: GetRapDto) {
    try {
      let { maPhim } = param;

      let data = await prisma.phim.findUnique({
        where: { ma_phim: Number(maPhim) },

        include: {
          lichChieu: {
            include: {
              rapPhim: {
                include: {
                  cumRap: {
                    include: {
                      heThongRap: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const lichChieuPhim = {};

      data.lichChieu.forEach((lichChieu) => {
        const maCumRap = lichChieu.rapPhim.ma_cum_rap;

        if (!lichChieuPhim[maCumRap]) {
          lichChieuPhim[maCumRap] = [];
        }

        lichChieuPhim[maCumRap].push({
          ma_lich_chieu: lichChieu.ma_lich_chieu,
          ma_rap: lichChieu.ma_rap,
          ten_rap: lichChieu.rapPhim.ten_rap,
          ngay_gio_chieu: lichChieu.ngay_gio_chieu,
          gia_ve: lichChieu.gia_ve,
        });
      });

      const heThongRap = Object.keys(lichChieuPhim).map((maCumRap) => ({
        cumRapChieu: [
          {
            lichChieuPhim: lichChieuPhim[maCumRap],
            maCumRap: parseInt(maCumRap),
            tenCumRap: data.lichChieu.find(
              (lichChieu) =>
                lichChieu.rapPhim.ma_cum_rap === parseInt(maCumRap),
            ).rapPhim.cumRap.ten_cum_rap,
            diaChi: data.lichChieu.find(
              (lichChieu) =>
                lichChieu.rapPhim.ma_cum_rap === parseInt(maCumRap),
            ).rapPhim.cumRap.dia_chi,
          },
        ],
        maHeThongRap: data.lichChieu.find(
          (lichChieu) => lichChieu.rapPhim.ma_cum_rap === parseInt(maCumRap),
        ).rapPhim.cumRap.heThongRap.ma_he_thong_rap,
        tenHeThongRap: data.lichChieu.find(
          (lichChieu) => lichChieu.rapPhim.ma_cum_rap === parseInt(maCumRap),
        ).rapPhim.cumRap.heThongRap.ten_he_thong_rap,
        logo: data.lichChieu.find(
          (lichChieu) => lichChieu.rapPhim.ma_cum_rap === parseInt(maCumRap),
        ).rapPhim.cumRap.heThongRap.logo,
      }));

      const content = [
        {
          heThongRap: heThongRap,
          maPhim: data.ma_phim,
          tenPhim: data.ten_phim,
          trailer: data.trailer,
          hinhAnh: data.hinh_anh,
          moTa: data.mo_ta,
          hot: data.hot,
          dangChieu: data.dang_chieu,
          sapChieu: data.sap_chieu,
          ngayKhoiChieu: data.ngay_khoi_chieu,
          danhGia: data.danh_gia,
        },
      ];

      return createResponse(200, 'Xử lý thành công', content);
    } catch (error) {
      console.log(error);
      return createResponse(500, 'Đã xảy ra lỗi khi xử lý yêu cầu', error);
    }
    // try {
    //   let { maPhim } = param;
    //   console.log(maPhim);
    //   const checkMaPhim = await prisma.phim.findFirst({
    //     where: {
    //       ma_phim: Number(maPhim),
    //     },
    //   });

    //   console.log(checkMaPhim);

    //   if (!checkMaPhim) {
    //     return createResponse(
    //       400,
    //       'Không tìm thấy tài nguyên',
    //       'Mã phim không tồn tại',
    //     );
    //   }

    //   const thongTinLichChieu = await prisma.phim.findUnique({
    //     where: {
    //       ma_phim: Number(maPhim),
    //     },
    //     include: {
    //       lichChieu: {
    //         include: {
    //           rapPhim: {
    //             include: {
    //               cumRap: {
    //                 include: {
    //                   heThongRap: true,
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });

    //   const lichChieuGomNhom = {};
    //   thongTinLichChieu.lichChieu.forEach((lichChieu) => {
    //     const maCumRap = lichChieu.rapPhim.cumRap.ma_cum_rap;
    //     if (!lichChieuGomNhom[maCumRap]) {
    //       lichChieuGomNhom[maCumRap] = [];
    //     }
    //     lichChieuGomNhom[maCumRap].push({
    //       maLichChieu: lichChieu.ma_lich_chieu,
    //       maRap: lichChieu.rapPhim.ma_rap,
    //       tenRap: lichChieu.rapPhim.ten_rap,
    //       ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
    //       giaVe: lichChieu.gia_ve,
    //     });
    //   });

    //   // Ghép các lịch chiếu có cùng maCumRap vào với nhau
    //   const heThongRapChieu = Object.keys(lichChieuGomNhom).map((maCumRap) => ({
    //     cumRapChieu: [
    //       {
    //         lichChieuPhim: lichChieuGomNhom[maCumRap],
    //         maCumRap: parseInt(maCumRap),
    //         tenCumRap: thongTinLichChieu.lichChieu.find(
    //           (lichChieu) =>
    //             lichChieu.rapPhim.cumRap.ma_cum_rap === parseInt(maCumRap),
    //         ).rapPhim.cumRap.ten_cum_rap,
    //         diaChi: thongTinLichChieu.lichChieu.find(
    //           (lichChieu) =>
    //             lichChieu.rapPhim.cumRap.ma_cum_rap === parseInt(maCumRap),
    //         ).rapPhim.cumRap.dia_chi,
    //       },
    //     ],
    //     maHeThong: thongTinLichChieu.lichChieu.find(
    //       (lichChieu) =>
    //         lichChieu.rapPhim.cumRap.ma_cum_rap === parseInt(maCumRap),
    //     ).rapPhim.cumRap.heThongRap.ma_he_thong_rap,
    //     tenHeThong: thongTinLichChieu.lichChieu.find(
    //       (lichChieu) =>
    //         lichChieu.rapPhim.cumRap.ma_cum_rap === parseInt(maCumRap),
    //     ).rapPhim.cumRap.heThongRap.ten_he_thong_rap,
    //     logo: thongTinLichChieu.lichChieu.find(
    //       (lichChieu) =>
    //         lichChieu.rapPhim.cumRap.ma_cum_rap === parseInt(maCumRap),
    //     ).rapPhim.cumRap.heThongRap.logo,
    //   }));

    //   const content = {
    //     heThongRapChieu: heThongRapChieu,
    //     maPhim: thongTinLichChieu.ma_phim,
    //     tenPhim: thongTinLichChieu.ten_phim,
    //     trailer: thongTinLichChieu.trailer,
    //     hinhAnh: thongTinLichChieu.hinh_anh,
    //     moTa: thongTinLichChieu.mo_ta,
    //     hot: thongTinLichChieu.hot,
    //     dangChieu: thongTinLichChieu.dang_chieu,
    //     sapChieu: thongTinLichChieu.sap_chieu,
    //     ngayKhoiChieu: thongTinLichChieu.ngay_khoi_chieu,
    //     danhGia: thongTinLichChieu.danh_gia,
    //   };

    //   const payload = createResponse(200, 'Xử lý thành công', content);

    //   return payload;
    // } catch (error) {
    //   const errorPayload = createResponse(
    //     500,
    //     'Đã xảy ra lỗi khi xử lý yêu cầu',
    //     error,
    //   );
    //   return errorPayload;
    // }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} rap`;
  // }

  // update(id: number, updateRapDto: UpdateRapDto) {
  //   return `This action updates a #${id} rap`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} rap`;
  // }
}
