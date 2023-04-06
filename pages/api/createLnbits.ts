import { LNBITS_API_HOST } from '@/utils/app/const';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const walletResponse = await fetch(`${LNBITS_API_HOST}/wallet?nme=aiUser`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
      },
    });

    if (walletResponse.status !== 200) {
      throw new Error('Error creating user.');
    }

    const pageResponseText = await walletResponse.text();

    const regex = /window.user = (.*);/
    const regexMatches = pageResponseText.match(regex)

    if (!regexMatches || !regexMatches[1]) {
      throw new Error('Unable to parse user object');
    }

    const obj = JSON.parse(regexMatches[1])

    return new Response(JSON.stringify(obj), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
