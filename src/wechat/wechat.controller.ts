import { WechatService } from './wechat.service';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
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
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).send('Invalid XML data');
      }

      // 在result对象中，您将获得解析后的XML消息内容
      const message = result.xml;

      // 在这里可以编写处理消息的逻辑
      console.log('Received message:', message);

      // 返回响应
      res.status(200).send('Message received');
    });
  }
}
