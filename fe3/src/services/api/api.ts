import user from './user';
import topics from './topics';
import countries from './countries';
import clubs from './clubs';
import votes from './votes';

const api = {
  ...user,
  ...topics,
  ...countries,
  ...clubs,
  ...votes,
};

export default api;