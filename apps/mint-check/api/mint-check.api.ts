import axios, { AxiosRequestConfig } from 'axios';
import { GetJwtPayload } from '../models/mint-check-api.models';

const getHeaderConfig = (headers: GetJwtPayload): AxiosRequestConfig => {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc.headers[key.toString()] = value;
    return acc;
  }, { headers: {} });
};

const URL = 'https://shielded-refuge-48115.herokuapp.com/';

export const getJWT = (payload: GetJwtPayload) => {
  return axios.post(`${URL}/users`, {
    user: {
      wallet_address: payload.wallet_address
    }
  }, getHeaderConfig(payload));
};
