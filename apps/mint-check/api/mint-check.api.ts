import axios, { AxiosRequestConfig } from 'axios';
import { GetJwtPayload } from '../models/mint-check-api.models';

const getHeaderConfig = (headers: GetJwtPayload): AxiosRequestConfig => {
  const moddedHeaders = Object.entries(headers).reduce((acc, [key, value]) => {
    acc.headers[key.toString()] = value;
    return acc;
  }, { headers: {} });
  return { ...moddedHeaders, headers: { ...moddedHeaders.headers, ...axios.defaults.headers.common, Referer: 'https://shielded-refuge-48115.herokuapp.com' } };
};

const URL = 'https://shielded-refuge-48115.herokuapp.com';

export const getJWT = (payload: GetJwtPayload) => {
  debugger;
  return axios.post('/users', {
    user: {
      wallet_address: payload.wallet_address
    }
  }, getHeaderConfig(payload));
};
