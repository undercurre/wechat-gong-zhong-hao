import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XinghuoModule } from './xinghuo/xinghuo.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WechatModule } from './wechat/wechat.module';
import { WechatController } from './wechat/wechat.controller';
import * as xmlBodyParser from 'express-xml-bodyparser';

@Module({
  imports: [XinghuoModule, WechatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(xmlBodyParser()).forRoutes(WechatController);
  }
}
