import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RapService } from './rap.service';
import { CreateRapDto } from './dto/create-rap.dto';
import { UpdateRapDto } from './dto/update-rap.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetRapDto } from './dto/get-rap.dto';

@ApiTags('QuanLyRap')
@Controller('rap')
export class RapController {
  constructor(private readonly rapService: RapService) {}

  // @Post()
  // create(@Body() createRapDto: CreateRapDto) {
  //   return this.rapService.create(createRapDto);
  // }

  @Get('/LayThongTinHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false, type: 'number' })
  findAll(@Query() param: GetRapDto) {
    return this.rapService.findAll(param);
  }

  @Get('/LayThongTinCumRapTheoHeThong')
  @ApiQuery({ name: 'maHeThongRap', required: false, type: 'number' })
  getCumRap(@Query() param: GetRapDto) {
    return this.rapService.getCumRap(param);
  }

  @Get('/LayThongTinLichChieuHeThongRap')
  @ApiQuery({ name: 'maHeThongRap', required: false, type: 'number' })
  getLichChieu(@Query() param: GetRapDto) {
    return this.rapService.getLichChieu(param);
  }

  @Get('/LayThongTinLichChieuPhim')
  @ApiQuery({ name: 'maPhim', required: false, type: 'number' })
  getLichChieuByPhim(@Query() param: GetRapDto) {
    return this.rapService.getLichChieuByPhim(param);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rapService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRapDto: UpdateRapDto) {
  //   return this.rapService.update(+id, updateRapDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rapService.remove(+id);
  // }
}
