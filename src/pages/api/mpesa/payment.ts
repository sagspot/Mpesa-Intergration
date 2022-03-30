import axios from 'axios';
import { dateTime } from '../../../utils/dates';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.AUTH}`,
};

const Timestamp = dateTime('now');
const shortCode = process.env.BUSINESS_SHORT_CODE;

const data = {
  BusinessShortCode: shortCode,
  Password: Buffer.from(shortCode! + process.env.PASS_KEY + Timestamp).toString(
    'base64'
  ),
  Timestamp,
  TransactionType: process.env.TRANSACTION_TYPE,
  Amount: 1,
  PartyA: 254708374149,
  PartyB: shortCode,
  PhoneNumber: 254703215696,
  CallBackURL: process.env.CALLBACK_URL,
  AccountReference: process.env.ACCOUNT_REFERENCE,
  TransactionDesc: 'Payment of X',
};

const sendReq = async () => {
  try {
    const res = await axios.request({
      method: 'POST',
      url: process.env.API_URL,
      headers,
      data,
    });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const getToken = async () => {
  try {
    const res = await axios.request({
      method: 'GET',
      url: process.env.API_URL,
      headers,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
