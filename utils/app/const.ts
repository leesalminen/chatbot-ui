export const DEFAULT_SYSTEM_PROMPT =
  process.env.DEFAULT_SYSTEM_PROMPT || "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const LNBITS_API_HOST =
  process.env.NEXT_PUBLIC_LNBITS_API_HOST || 'https://legend.lnbits.com'

export const SATS_PER_TOKEN = 
  process.env.SATS_PER_TOKEN || "0.5"

export const PAYMENT_RECIPIENT_LN_ADDRESS = 
  process.env.PAYMENT_RECIPIENT_LN_ADDRESS || 'lee2@pay.bitcoinjungle.app'