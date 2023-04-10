import { OPENAI_API_HOST } from '@/utils/app/const';
import { NextApiRequest, NextApiResponse } from 'next';
import { billUsage, BillingError } from '@/utils/server/lnbits'

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { messages, key, lnbitsKey } = req.body;

    const userMessage = messages[messages.length - 1];

    try {
      const billed = await billUsage(lnbitsKey, 500, 'image-generation')
    } catch(e: any) {
      console.warn('OUTPUT BILLING ERROR', e.message)
    }

    const answerRes = await fetch(`${OPENAI_API_HOST}/v1/images/generations`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`,
        ...(process.env.OPENAI_ORGANIZATION && {
          'OpenAI-Organization': process.env.OPENAI_ORGANIZATION,
        }),
      },
      method: 'POST',
      body: JSON.stringify({
        prompt: userMessage.content,
        n: 5,
      }),
    });

    const { data } = await answerRes.json();
    let answer = ''

    data.forEach((obj, index) => {
      const num = index + 1
      answer += `Image ${num}\n[![Image ${num}](${obj.url} "Image ${num}")](${obj.url})\n\n`
    })

    return res.status(200).json({answer});
  } catch (error) {
    if (error instanceof BillingError) {
      return res.status(402).send(error.message)
    } else {
      return res.status(500)
    }
  }
};

export default handler;
