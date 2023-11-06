import { Controller, Get, Query } from '@nestjs/common';
import * as crypto from 'crypto';

@Controller('wechat')
export class WechatController {
  @Get('server')
  verify(@Query() query: any) {
    const token = 'wechatlirh42'; // 替换成您在微信公众平台配置的Token
    const { signature, timestamp, nonce, echostr } = query;
    const params = [token, timestamp, nonce].sort().join('');
    const sha1 = crypto.createHash('sha1').update(params).digest('hex');

    if (sha1 === signature) {
      return echostr;
    } else {
      return 'Verification failed!';
    }
  }
}
