import axios from 'axios';
// export let url = 'http://localhost:8099';
export let url = 'https://i-saloon.herokuapp.com/';
const instance = axios.create({
  baseURL: url,
});

export default instance;
