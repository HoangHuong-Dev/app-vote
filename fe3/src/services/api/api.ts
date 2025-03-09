import user from './user';
import topics from './topics';
import countries from './countries';
import clubs from './clubs';
import votes from './votes';
import cities from './cities';

const api = {
  ...user,
  ...topics,
  ...countries,
  ...clubs,
  ...votes,
  ...cities,
};

export default api;