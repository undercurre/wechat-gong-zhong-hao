import { WechatService } from './wechat.service';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import * as crypto from 'crypto';
import { response } from 'express';

@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

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

  @Post('server')
  async handleWechatMessage(@Req() req, @Res() res) {
    const xmlData = req.body; // 获取微信发送的消息内容

    // 将 XML 转换为 JSON 格式
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlData, async (err, result) => {
      if (!err && result.xml) {
        const message = result.xml;
        const responseContent = await this.wechatService.getChat(message);
        res.status(200).send(reply);
      } else {
        res.status(400).send('Invalid XML');
      }
    });
  }
}
