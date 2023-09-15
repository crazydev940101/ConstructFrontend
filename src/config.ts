export const config = {
  server: process.env.NODE_ENV === 'production' ?
    'https://myairdoc-back.azurewebsites.net' :
    'http://localhost:8080',
  host: process.env.NODE_ENV === 'production' ?
    'https://calm-rock-0d9140b10.3.azurestaticapps.net' :
    'http://localhost:3000',
};
