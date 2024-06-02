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
} from '@nestjs/common';
import { DatVeService } from './dat-ve.service';
import { CreateDatVeDto } from './dto/create-dat-ve.dto';
import { UpdateDatVeDto } from './dto/update-dat-ve.dto';
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetDatVeDto } from './dto/get-dat-ve.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('DatVe')
@Controller('dat-ve')
export class DatVeController {
  constructor(private readonly datVeService: DatVeService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({ name: 'Authorization', required: true })
  @Post('/TaoLichChieu')
  create(@Body() createDatVeDto: CreateDatVeDto) {
    return this.datVeService.create(createDatVeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiHeader({ name: 'Authorization', required: true })
  @Post('/DatVe')
  datVe(@Body() datVe: GetDatVeDto) {
    return this.datVeService.datVe(datVe);
  }

  @Get('/LayDanhSachPhongVe')
  @ApiQuery({ name: 'maLichChieu', required: false, type: 'number' })
  getPhongVe(@Query() param: GetDatVeDto) {
    return this.datVeService.getPhongVe(param);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datVeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatVeDto: UpdateDatVeDto) {
    return this.datVeService.update(+id, updateDatVeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datVeService.remove(+id);
  }
}
