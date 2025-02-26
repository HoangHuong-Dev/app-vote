import network from '../network/network';
import { AxiosResponse } from 'axios';

export type NetworkPromiseResponse<T> = Promise<T>;

export const login = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('login', 'POST', {
        email,
        password,
      })
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res as any);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const register = (name: string, email: string, password: string) => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('register', 'POST', {
        name,
        email,
        password,
      })
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res as any);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export default {
  login,
  register
};
