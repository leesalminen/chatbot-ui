import { SATS_PER_TOKEN, LNBITS_API_HOST, PAYMENT_RECIPIENT_LN_ADDRESS } from '../app/const';

export class BillingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BillingError';
  }
}

export const billUsage = async (
  lnbitsKey: string,
  tokenCount: number,
  type: string
) => {
  const satsToBill = Math.round(tokenCount * parseFloat(SATS_PER_TOKEN))

  const message = `AI Usage: ${tokenCount} tokens (${SATS_PER_TOKEN} sats per token) for ${type}`
  console.log(message)

  try {
    const addressParts = PAYMENT_RECIPIENT_LN_ADDRESS.split('@')

    if(!addressParts || addressParts.length !== 2) {
      throw new Error("Invalid Lightning Address")
    }

    const lnurl = await fetch(`https://${addressParts[1]}/.well-known/lnurlp/${addressParts[0]}`);

    if(lnurl.status !== 200) {
      throw new Error(`Status code error: ${lnurl.status}`)
    }

    const lnurlData = await lnurl.json()

    if(!lnurlData.callback) {
      throw new Error("No callback provided")
    }

    const callback = await fetch(`${lnurlData.callback}?amount=${satsToBill * 1000}&comment=${encodeURIComponent(message)}`)

    if(callback.status !== 200) {
      throw new Error(`Status code error: ${callback.status}`)
    }

    const callbackData = await callback.json()

    if(!callbackData.pr) {
      throw new Error("No invoiced provided from callback")
    }

    const walletResponse = await fetch(`${LNBITS_API_HOST}/api/v1/payments`, {
      method: 'POST',
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Api-Key": lnbitsKey,
      },
      body: JSON.stringify({
        out: true,
        bolt11: callbackData.pr,
      })
    });

    if (walletResponse.status !== 201) {
      throw new Error("Status code error")
    }

    const data = await walletResponse.json()

    if(!data.payment_hash) {
      throw new Error("Missing Payment Hash")
    }

    return data
  } catch (error) {
    console.error(error);
    throw new BillingError(`Unable to bill ${satsToBill} sats from your LNBits Wallet.`)
  }
};
