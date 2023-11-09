import { ChatgptModule } from './chatgpt/chatgpt.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XinghuoModule } from './xinghuo/xinghuo.module';
import { WechatModule } from './wechat/wechat.module';
import { WechatController } from './wechat/wechat.controller';
import * as bodyParser from 'body-parser';

@Module({
  imports: [XinghuoModule, WechatModule, ChatgptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyParser.text({ type: 'text/xml' }))
      .forRoutes(WechatController);
  }
}
