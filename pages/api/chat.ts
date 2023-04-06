import { ChatBody, Message } from '@/types/chat';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';
import { countTokens } from '@/utils/server/tokens'
import { billUsage, BillingError } from '@/utils/server/lnbits'
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';
// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { model, messages, key, lnbitsKey, prompt } = (await req.json()) as ChatBody;

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let tokenCount = await countTokens(promptToSend)
    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = await countTokens(message.content);

      if (tokenCount + tokens + 1000 > model.tokenLimit) {
        break;
      }
      tokenCount += tokens;
      messagesToSend = [message, ...messagesToSend];
    }

    const billed = await billUsage(lnbitsKey, tokenCount, 'input')

    const stream = await OpenAIStream(model, promptToSend, key, lnbitsKey, messagesToSend);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else if (error instanceof BillingError) {
      return new Response('Error', {status: 402, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
