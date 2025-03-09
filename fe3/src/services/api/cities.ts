import network from '../network/network';
import { AxiosResponse } from 'axios';
import type { Country } from './countries';

export type City = {
  id: number;
  name: string;
  country_id: number;
  country?: Country;
  is_active: boolean;
};

export const getCitiesByCountry = (countryId: number) => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest(`cities?country_id=${countryId}`, 'GET')
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
  getCitiesByCountry,
}; 