export const API_URL = 'http://10.0.2.2:8000';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  LOGOUT: '/api/logout',
  
  // Topics
  TOPICS: '/api/topics',
  TOPIC_DETAIL: (id: number) => `/api/topics/${id}`,
  
  // Countries
  COUNTRIES: '/api/countries',
  COUNTRY_DETAIL: (id: number) => `/api/countries/${id}`,
  
  // Clubs
  CLUBS: '/api/clubs',
  CLUBS_BY_COUNTRY: (countryId: number) => `/api/clubs?country_id=${countryId}`,
  CLUB_DETAIL: (id: number) => `/api/clubs/${id}`,
  
  // Votes
  VOTES: '/api/votes',
  VOTE_DETAIL: (id: number) => `/api/votes/${id}`,
};

export const getApiUrl = (endpoint: string) => `${API_URL}${endpoint}`;