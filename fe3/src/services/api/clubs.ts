import network from '../network/network';
import { AxiosResponse } from 'axios';

export type Club = {
  id: number;
  name: string;
  logo: string;
  image: string;
  description: string;
  country_id: number;
  votes_count: number;
  is_active: boolean;
};

export const getClubsByCountryAndTopic = (countryId: number, topicId: number) => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest(`clubs?country_id=${countryId}&topic_id=${topicId}`, 'GET')
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
  getClubsByCountryAndTopic,
}; 