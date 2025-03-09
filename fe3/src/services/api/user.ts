import network from '../network/network';
import { AxiosResponse } from 'axios';

export type NetworkPromiseResponse<T> = Promise<T>;

export type RegisterResponse = {
  message: string;
  email: string;
};

export type VerifyEmailResponse = {
  message: string;
  access_token?: string;
  user?: any;
};

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

export const register = (
  name: string, 
  email: string, 
  password: string,
  topicId: number,
  countryId: number,
  clubId: number
): Promise<RegisterResponse> => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('register', 'POST', {
        name,
        email,
        password,
        topic_id: topicId,
        country_id: countryId,
        club_id: clubId
      })
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res as RegisterResponse);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const verifyEmail = (email: string, code: string): Promise<VerifyEmailResponse> => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('verify-email', 'POST', {
        email,
        code
      })
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res as VerifyEmailResponse);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const resendVerificationCode = (email: string): Promise<{message: string}> => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('resend-verification', 'POST', {
        email
      })
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res as {message: string});
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export default {
  login,
  register,
  verifyEmail,
  resendVerificationCode
};
