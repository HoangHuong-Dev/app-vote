import network from '../network/network';
import { AxiosResponse } from 'axios';
import { Club } from './clubs';

export type Country = {
  id: number;
  name: string;
  code: string;
  flag: string;
  image: string;
  is_active: boolean;
  clubs: Club[];
};

export const getCountries = (topicId?: number) => {
  const params = topicId ? `?topic_id=${topicId}` : '?topic_id=1';
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest(`countries${params}`, 'GET')
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
  getCountries,
}; 