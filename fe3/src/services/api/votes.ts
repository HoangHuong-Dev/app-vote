import network from '../network/network';
import { AxiosResponse } from 'axios';

export type Vote = {
  id: number;
  user_id: number;
  topic_id: number;
  club_id: number;
  created_at: string;
};

export const submitVote = (topicId: number, clubId: number) => {
  return new Promise((resolve, reject) => {
    console.log('Submitting vote with token:', network.getToken());
    
    network
      .authorizedRequest('votes', 'POST', {
        topic_id: topicId,
        club_id: clubId
      })
      .then((res: AxiosResponse) => {
        if (res.status >= 400) {
          reject(res);
          return;
        }
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const getUserVotes = () => {
  return new Promise((resolve, reject) => {
    network
      .authorizedRequest('votes', 'GET')
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
  submitVote,
  getUserVotes,
}; 