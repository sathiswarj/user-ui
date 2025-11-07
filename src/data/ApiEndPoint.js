export const API_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';