import MainApi from './MainApi';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const services = {
  mainApi: new MainApi(apiBaseUrl)
};

export default services;