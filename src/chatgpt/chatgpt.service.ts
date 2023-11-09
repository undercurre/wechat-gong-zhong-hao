import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
// import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ChatgptService {
  async getChat(question: string): Promise<string> {
    const openai = new OpenAI({
      apiKey: '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',
      // httpAgent: new HttpsProxyAgent('http://127.0.0.1:10809'), // 配置你的vpn端口
    });
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: question }],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }
}
