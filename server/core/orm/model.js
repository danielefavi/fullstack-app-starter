import OrmQueryBuilder from './orm-query-builder.js';
import app from '../app-service-container.js';

export default class Model {

  data = {};

  id = null;

  static fields = [];

  static table = '';

  static idField = 'id';

  static autoIncrement = true;

  constructor(data) {
    if (data) {
      this.setData(data);
    }
  }

  static async getById(id) {
    const [rows, fields] = await app.get('db').execute(`
      SELECT * 
      FROM ${this.table} 
      WHERE ${this.idField} = ?
    `, [
      id
    ]);

    if (rows.length === 0) {
      return null;
    }

    return new this(rows[0]);
  }

  static async create(data) {
    let fieldList = [];
    let values = [];

    for (const field of this.fields) {
      if (data[field] === undefined) continue;
      fieldList.push(field);
      values.push(data[field]);
    }

    await app.get('db').execute(
      `INSERT INTO ${this.table} (
        ${fieldList.join(', ')}
      ) VALUES (${fieldList.map(() => '?').join(', ')})`,
      values
    );

    if (this.autoIncrement) {
      const [rows, fields] = await app.get('db').execute('SELECT LAST_INSERT_ID() as id');
      data[this.idField] = rows[0].id;
    }

    return new this(data);
  }

  async update(data) {
    delete data[this.constructor.idField];
    this.setData(data);

    let fieldList = [];
    let values = [];

    for (const field of this.constructor.fields) {
      if (data[field] === undefined) continue;
      fieldList.push(`${field} = ?`);
      values.push(data[field]);
    }

    return await app.get('db').execute(
      `UPDATE ${this.constructor.table} SET
        ${fieldList.join(', ')}
        WHERE id = ?
      `,
      [ ...values, this.id ]
    );
  }

  async save() {
    const elem = await this.constructor.getById(this.id);

    if (elem) {
      for (const field of this.constructor.fields) {
        if (this.data[field] !== undefined && this.data[field] !== elem.data[field]) {
          await this.update(this.data);
          return true;
        }
      }
    } else {
      await this.create(this.data);
      return true;
    }

    return false;
  }

  setData(data, checkIdField = true) {
    if (
      !this[this.constructor.idField] && 
      data[this.constructor.idField] === undefined &&
      checkIdField
    ) {
      throw new Error(`Field ${this.constructor.idField} is required`);
    }

    if (!this[this.constructor.idField]) {
      this[this.constructor.idField] = data[this.constructor.idField];
    }
    delete data[this.constructor.idField];

    // for (const field of this.constructor.fields) {
    //   if (data[field] !== undefined) {
    //     this.data[field] = data[field];
    //   }
    // }

    this.data = {
      ...this.data,
      ...data
    };
  }

  static query() {
    return new OrmQueryBuilder(this);
  }

  toJSON() {
    return {
      id: this.id,
      ...this.data
    };
  }

}