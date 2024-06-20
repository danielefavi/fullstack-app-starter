import QueryBuilder from './query-builder.js';
import app from '../app-service-container.js';

export default class OrmQueryBuilder extends QueryBuilder {

  model = null;

  constructor(model) {
    super();

    if (!model) {
      throw new Error('The model is required');
    }

    this.model = model;
    super.from(model.table);
    super.select(`${model.table}.*`);
  }

  resetQuery() {
    this.resetQuery();
    this.from(this.model.table);
  }

  async get() {
    const list = [];

    const { query, values } = this.getQuery();
    const [rows, fields] = await app.get('db').execute(query, values);

    for (const row of rows) {
      list.push(new this.model(row));
    }

    return list;
  }

  async first() {
    this.limit(1);
    const { query, values } = this.getQuery();

    const [rows, fields] = await app.get('db').execute(query, values);

    if (rows.length === 0) {
      return null;
    }

    return new this.model(rows[0]);
  }

}