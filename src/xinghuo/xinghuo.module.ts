import { Module } from '@nestjs/common';
import { XinghuoController } from './xinghuo.controller';
import { XinghuoService } from './xinghuo.service';

@Module({
  controllers: [XinghuoController],
  providers: [XinghuoService],
})
export class XinghuoModule {}
