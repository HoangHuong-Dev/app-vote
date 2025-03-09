import network from '../network/network';
import { AxiosResponse } from 'axios';
import type { City } from './cities';

export type Club = {
  id: number;
  name: string;
  logo: string;
  image: string;
  description: string;
  city_id: number;
  city?: City;
  votes_count: number;
  is_active: boolean;
};

export const getClubsByCountryAndTopic = (cityId: number, topicId: number) => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest(`clubs?city_id=${cityId}&topic_id=${topicId}`, 'GET')
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

export const getClubRankingsByCountry = (countryId: number) => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest(`rankings/country/${countryId}`, 'GET')
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
  getClubRankingsByCountry
}; 