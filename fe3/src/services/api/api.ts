import user from './user';
import topics from './topics';
import countries from './countries';
import clubs from './clubs';
import votes from './votes';

export default {
  ...user,
  ...topics,
  ...countries,
  ...clubs,
  ...votes,
};
