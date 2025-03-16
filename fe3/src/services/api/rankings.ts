import network from '../network/network';
import { AxiosResponse } from 'axios';

export const getClubRankings = () => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/rankings/clubs', 'GET')
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(new Error(`API error: ${res.status}`));
          return;
        }
        resolve(res);
      });
  });
};

export const getCountryRankings = () => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/rankings/countries', 'GET')
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getCityRankings = () => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('/rankings/cities', 'GET')
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const searchClubs = (query: string) => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest(`/clubs/search?q=${query}`, 'GET')
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
        }
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}; 