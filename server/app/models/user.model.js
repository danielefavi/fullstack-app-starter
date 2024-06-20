import Model from '#core/orm/model.js';

export default class User extends Model {

  static table = 'users';

  static fields = [
    'id',
    'name',
    'email',
    'age',
  ];

  static async getSeniors() {
    return await this.query()
      .where('age', '>', 80)
      .get();
  }

}