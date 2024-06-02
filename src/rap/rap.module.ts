import { Module } from '@nestjs/common';
import { RapService } from './rap.service';
import { RapController } from './rap.controller';

@Module({
  controllers: [RapController],
  providers: [RapService],
})
export class RapModule {}
