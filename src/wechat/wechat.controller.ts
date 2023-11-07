import { WechatService } from './wechat.service';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as xml2js from 'xml2js';

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
  async handleMessage(@Req() req: Request, @Res() res: Response) {
    // 使用express-xml-bodyparser中间件来解析XML消息
    const xmlData = req.body;

    // 解析XML数据
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlData, async (err, result) => {
      if (err) {
        return res.status(500).send('Invalid XML data');
      }

      // 在result对象中，您将获得解析后的XML消息内容
      const receivedMessage = result.xml;

      const AIRes = await this.wechatService.getChat(receivedMessage.Content);

      // 构建要发送的XML响应
      const responseMessage = {
        xml: {
          ToUserName: receivedMessage.FromUserName,
          FromUserName: receivedMessage.ToUserName,
          CreateTime: Math.floor(Date.now() / 1000), // 当前时间戳
          MsgType: 'text',
          Content: AIRes.answer, // 自定义回复消息内容
        },
      };

      const builder = new xml2js.Builder();
      const xmlResponse = builder.buildObject(responseMessage);

      console.log('response', responseMessage);

      // 发送XML响应给微信服务器
      res.set('Content-Type', 'text/xml');
      res.status(200).send(xmlResponse);
    });
  }
}
