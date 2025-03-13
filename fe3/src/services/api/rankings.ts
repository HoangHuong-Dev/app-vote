import network from '../network/network';
import { AxiosResponse } from 'axios';

export interface RankingItem {
  id: number;
  name: string;
  votes_count: number;
  latitude?: number;
  longitude?: number;
}

export const getClubRankings = () => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('/rankings/clubs', 'GET')
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res.data);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getCountryRankings = () => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('/rankings/countries', 'GET')
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res.data);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getCityRankings = () => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest('/rankings/cities', 'GET')
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res.data);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const searchClubs = (query: string) => {
  return new Promise((resolve, reject) => {
    network
      .unAuthorizedRequest(`/clubs/search?q=${query}`, 'GET')
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res.data);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}; 