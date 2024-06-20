import Api from './Api';

export default class MainApi extends Api {

  async users() {
    return await this.get('users');
  }

  async createUser(data) {
    console.log('the data is', data);
    return await this.post('users/create', data);
  }

}