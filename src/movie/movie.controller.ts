import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SearchMovieDto } from './dto/search-movie.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePhimDto } from './dto/update-movie-admin.dto';
import { createResponse, decodedToken } from 'src/ultis/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get('/LayDanhSachBanner')
  findAll() {
    return this.movieService.findAll();
  }

  @Get('/LayDanhSachPhim')
  getPhim() {
    return this.movieService.getPhim();
  }

  @Get('/LayThongTinPhim')
  @ApiQuery({ name: 'maPhim', required: false, type: 'number' })
  getThongTinPhim(@Query() param: SearchMovieDto) {
    return this.movieService.getThongTinPhim(param);
  }

  @Get('/LayDanhSachPhimPhanTrang')
  @ApiQuery({ name: 'tenPhim', required: false, type: 'string' })
  @ApiQuery({ name: 'soTrang', required: false, type: 'number' })
  @ApiQuery({ name: 'soPhanTuTranTrang', required: false, type: 'number' })
  getPhimPhanTrang(@Query() param: SearchMovieDto) {
    return this.movieService.getPhimPhanTrang(param);
  }

  @Get('/LayDanhSachPhimTheoNgay')
  @ApiQuery({ name: 'tenPhim', required: false, type: 'string' })
  @ApiQuery({ name: 'soTrang', required: false, type: 'number' })
  @ApiQuery({ name: 'soPhanTuTranTrang', required: false, type: 'number' })
  @ApiQuery({ name: 'tuNgay', required: false, type: 'string' })
  @ApiQuery({ name: 'denNgay', required: false, type: 'string' })
  getPhimTheoNgay(@Query() param: SearchMovieDto) {
    return this.movieService.getPhimTheoNgay(param);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('/CapNhatPhimUpload')
  async capNhatPhimUpload(
    @Req() req: Request,
    @Query('maPhim') maPhim: number,
    @Body() updatePhimDto: UpdatePhimDto,
  ) {
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
    return await this.movieService.capNhatPhimUpload(+maPhim, updatePhimDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('/TaoPhim')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          callback(null, new Date().getTime() + `${file.originalname}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dữ liệu của file',
    required: true,
    schema: {
      type: 'object',

      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        tenPhim: {
          type: 'string',
          description: 'Tên phim',
        },
      },
    },
  })
  async quanLyPhim(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
    @Body('tenPhim') tenPhim: string,
  ): Promise<any> {
    const authorizationToken = (req.headers as any).authorization;
    const token = authorizationToken.split('Bearer ')[1];
    const userInfo = await decodedToken(token);
    if (userInfo.loai_nguoi_dung !== 'admin') {
      return createResponse(
        400,
        'Unauthorized',
        'Chỉ có admin mới có thể quản lý phim !',
      );
    }
    return await this.movieService.quanLyPhim(file, tenPhim);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Delete('/XoaPhim')
  async xoaPhim(@Req() req: Request, @Query('maPhim') maPhim: number) {
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
    return await this.movieService.xoaPhim(+maPhim);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }
}
