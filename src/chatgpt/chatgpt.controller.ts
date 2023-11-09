import { Body, Controller, Post } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { ChatgptDto } from './chatgpt.dto';

@Controller('chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post('getChat')
  async getChat(@Body() chatgptDto: ChatgptDto) {
    const response = await this.chatgptService.getChat(chatgptDto.question);
    return response;
  }
}
