import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XinghuoModule } from './xinghuo/xinghuo.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WechatModule } from './wechat/wechat.module';

@Module({
  imports: [XinghuoModule, WechatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
