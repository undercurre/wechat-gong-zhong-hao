import { Injectable } from '@nestjs/common';
import * as base64 from 'base-64';
import { HmacSHA256, enc } from 'crypto-js';
import * as WebSocket from 'ws';

@Injectable()
export class XinghuoService {
  private config: {
    APPID: string;
    APISecret: string;
    APIKey: string;
    Uid: string;
    sparkResult: string;
  };

  constructor() {
    this.config = {
      APPID: '1288b463',
      APISecret: 'YjExNmM2ODAyMmEyNzU1ZTVlMDFhNDJj',
      APIKey: 'bc22669633ed221cd5d15c36a9e15eb7',
      Uid: 'lirh42',
      sparkResult: '',
    };
  }

  getChat(question: string): Promise<{ answer: string }> {
    return new Promise((resolve, reject) => {
      const sendMsg = (text: string) => {
        console.log('发送信息，请求AI处理');
        // 获取请求地址
        const myUrl = getWebsocketUrl();
        // 每次发送问题 都是一个新的websocketqingqiu
        const socket = new WebSocket(myUrl as string);
        // 本次对话的完整回答的存储
        let tres = '';
        // 监听websocket的各阶段事件 并做相应处理
        socket.on('open', () => {
          console.log('开启连接！！');
          // 发送消息
          const params = {
            header: {
              app_id: this.config.APPID,
              uid: 'lirh42',
            },
            parameter: {
              chat: {
                domain: 'general',
                temperature: 0.5,
                max_tokens: 1024,
              },
            },
            payload: {
              message: {
                // 如果想获取结合上下文的回答，需要开发者每次将历史问答信息一起传给服务端，如下示例
                // 注意：text里面的所有content内容加一起的tokens需要控制在8192以内，开发者如有较长对话需求，需要适当裁剪历史信息
                text: [
                  { role: 'user', content: '你是谁' }, //# 用户的历史问题
                  { role: 'assistant', content: '我是AI助手' }, //# AI的历史回答结果
                  // ....... 省略的历史对话
                  { role: 'user', content: text }, //# 最新的一条问题，如无需上下文，可只传最新一条问题
                ],
              },
            },
          };
          console.log('发送消息');
          socket.send(JSON.stringify(params));
        });
        socket.on('message', (event: any) => {
          const data = JSON.parse(event);
          console.log('收到消息！！', data);
          this.config.sparkResult += data.payload.choices.text[0].content;
          tres += data.payload.choices.text[0].content;
          if (data.header.code !== 0) {
            console.log('出错了', data.header.code, ':', data.header.message);
            // 出错了"手动关闭连接"
            socket.close();
          }
          if (data.header.code === 0) {
            // 对话已经完成
            if (data.payload.choices.text && data.header.status === 2) {
              this.config.sparkResult += data.payload.choices.text[0].content;
              setTimeout(() => {
                // "对话完成，手动关闭连接"
                socket.close();
              }, 1000);
            }
          }
        });
        socket.on('close', () => {
          console.log('连接关闭！！');
          console.log('本次回答', tres);
          resolve({ answer: tres });
          tres = '';
          // 对话完成后socket会关闭，将聊天记录换行处理
          this.config.sparkResult = this.config.sparkResult + '\n';
        });

        // 处理连接错误
        socket.on('error', () => {
          console.error('连接错误:');
          reject();
        });
      };

      const getWebsocketUrl = () => {
        let url = 'wss://spark-api.xf-yun.com/v1.1/chat';
        const host = 'spark-api.xf-yun.com/v1.1/chat';
        const apiKeyName = 'api_key';
        const date = new Date().toUTCString();
        const algorithm = 'hmac-sha256';
        const headers = 'host date request-line';
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
        const signatureSha = HmacSHA256(signatureOrigin, this.config.APISecret);
        const signature = enc.Base64.stringify(signatureSha);

        const authorizationOrigin = `${apiKeyName}="${this.config.APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;

        const authorization = base64.encode(authorizationOrigin);

        // 将空格编码
        url = `${url}?authorization=${authorization}&date=${encodeURI(
          date,
        )}&host=${host}`;
        return url;
      };

      sendMsg(question);
    });
  }
}
