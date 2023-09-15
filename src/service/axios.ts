import axios from 'axios';

import { config } from '../config';
import { getLocalStorage } from '../store/storage';

export const server_url = config.server;

interface RequestType {
  method: string;
  url: string;
  headers?: any;
  data?: any;
}

export const getToken = () => {
  const storage = getLocalStorage('accessToken');

  if (storage.status) {
    return storage.data;
  }
  return null
}

export const axiosRequest = (method: string, url: string, isPrivate: boolean, data?: any, tkn: string | null = null) => {
  try {
    let token = '';

    if (isPrivate) {
      const storage = getLocalStorage('accessToken');

      if (storage.status) {
        token = storage.data;
      }
    }

    let options = {
      method: method,
      url: server_url + url,
    } as RequestType;

    if(tkn) token = tkn;

    if (isPrivate) {
      options.headers = {
        Authorization: `Bearer ${token}` || null,
        accept: '*/*',
      };
    }

    if (data) {
      options.data = data;
    }

    return axios(options).then((response: any) => response?.data);
  } catch (err) {
    // console.error(err);
    // throw err
  }
};

export const urlRequest = (url: string) => {
  window.location.href = server_url + url;
};
