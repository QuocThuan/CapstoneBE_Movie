import { PartialType } from '@nestjs/swagger';
import { CreateRapDto } from './create-rap.dto';

export class UpdateRapDto extends PartialType(CreateRapDto) {}
