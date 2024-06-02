import { PartialType } from '@nestjs/swagger';
import { CreateDatVeDto } from './create-dat-ve.dto';

export class UpdateDatVeDto extends PartialType(CreateDatVeDto) {}
