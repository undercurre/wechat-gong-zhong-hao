import { Body, Controller, Post } from '@nestjs/common';
import { XinghuoService } from './xinghuo.service';
import { XinghuoDto } from './xinghuo.dto';

@Controller('xinghuo')
export class XinghuoController {
  constructor(private readonly xinghuoService: XinghuoService) {}

  @Post('getChat')
  async getChat(@Body() xinghuoDto: XinghuoDto) {
    const response = await this.xinghuoService.getChat(xinghuoDto.question);
    return response;
  }
}
