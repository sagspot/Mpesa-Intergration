import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { dateTime } from '../../../utils/dates';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;

const BUSINESS_SHORT_CODE = Number(process.env.BUSINESS_SHORT_CODE);
const PASS_KEY = process.env.PASS_KEY;
const TRANSACTION_TYPE = process.env.TRANSACTION_TYPE;
const CALLBACK_URL = process.env.CALLBACK_URL;
const ACCOUNT_REFERENCE = process.env.ACCOUNT_REFERENCE;
const TIMESTAMP = dateTime();

const tokenUrl = process.env.TOKEN_URL;
const stkUrl = process.env.STK_URL;

// generate token
async function getToken() {
  const url = tokenUrl;
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    'base64'
  );

  const headers = { Authorization: `Basic ${auth}` };

  const res = await axios.request({ method: 'GET', url, headers });

  return res.data.access_token;
}

//   stk push
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      try {
        const { PhoneNumber, Amount } = req.body;
        const token = await getToken();
        const url = stkUrl;

        const data = {
          BusinessShortCode: BUSINESS_SHORT_CODE,
          Password: Buffer.from(
            `${BUSINESS_SHORT_CODE}${PASS_KEY}${TIMESTAMP}`
          ).toString('base64'),
          Timestamp: TIMESTAMP,
          TransactionType: TRANSACTION_TYPE,
          Amount,
          PartyA: PhoneNumber,
          PartyB: BUSINESS_SHORT_CODE,
          PhoneNumber,
          CallBackURL: CALLBACK_URL,
          AccountReference: ACCOUNT_REFERENCE,
          TransactionDesc: 'Payment of logistics services',
        };

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.request({
          method: 'POST',
          url,
          headers,
          data,
        });

        res.status(200).json(response.data);
      } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Something went wrong', error });
      }
      break;

    default:
      res.status(405).json({ message: `${req.method} method not allowed` });
      break;
  }
}
