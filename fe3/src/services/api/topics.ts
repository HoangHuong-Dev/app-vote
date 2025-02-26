import network from '../network/network';
import { AxiosResponse } from 'axios';
import type { Country } from './countries';

export type Topic = {
  id: number;
  title: string;
  description: string;
  image: string;
  image_url: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  countries: Country[];
};

export const getTopics = () => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('topics', 'GET')
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

export const getTopicDetails = (topicId: number) => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest(`topics/${topicId}`, 'GET')
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
  getTopics,
  getTopicDetails,
}; 