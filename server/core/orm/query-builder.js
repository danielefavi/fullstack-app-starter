import app from '../app-service-container.js';

export default class QueryBuilder {

  whereClause = [];
  limitClause = null;
  offsetClause = null;
  orderByClause = [];
  groupByClause = [];
  selectClause = [];
  fromClause = null;
  queryValues = [];
  joinClause = [];

  resetQuery() {
    this.whereClause = [];
    this.limitClause = null;
    this.offsetClause = null;
    this.orderByClause = [];
    this.groupByClause = [];
    this.selectClause = [];
    this.fromClause = null;
    this.queryValues = [];
    this.joinClause = [];
  }

  select(...fields) {
    this.selectClause = this.selectClause.concat(fields);
    return this;
  }

  from(from) {
    this.fromClause = from;
    return this;
  }

  join(table, field1, condition, field2, direction='') {
    this.joinClause.push({
      direction,
      table,
      field1,
      condition,
      field2
    });

    return this;
  }

  leftJoin(table, field1, condition, field2) {
    return this.join(table, field1, condition, field2, 'LEFT');
  }

  rightJoin(table, field1, condition, field2) {
    return this.join(table, field1, condition, field2, 'RIGHT');
  }

  innerJoin(table, field1, condition, field2) {
    return this.join(table, field1, condition, field2, 'INNER');
  }

  outerJoin(table, field1, condition, field2) {
    return this.join(table, field1, condition, field2, 'OUTER');
  }

  joinRaw(clause) {
    this.joinClause.push({ rawClause: clause });
    return this;
  }

  where(field, condition, value, conn='AND') {
    this.whereClause.push({
      clause: `${field} ${condition} ?`,
      conn
    });

    this.queryValues.push(value);

    return this;
  }

  orWhere(field, condition, value) {
    return this.where(field, condition, value, 'OR');
  }

  whereRaw(clause, conn='AND') {
    this.whereClause.push({clause, conn});
    return this;
  }

  orWhereRaw(clause) {
    return this.where(clause, 'OR');
  }

  whereNull(field, conn='AND') {
    this.whereClause.push({
      clause: `${field} IS NULL`,
      conn
    });

    return this;
  }

  orWhereNull(field) {
    return this.whereNull(field, 'OR');
  }

  whereNotNull(field, conn='AND') {
    this.whereClause.push({
      clause: `${field} IS NOT NULL`,
      conn
    });

    return this;
  }

  whereIn(field, values, conn='AND') {
    this.whereClause.push({
      clause: `${field} IN (${values.map(() => '?').join(', ')})`,
      conn
    });

    this.queryValues = this.queryValues.concat(values);

    return this;
  }

  orWhereIn(field, values) {
    return this.whereIn(field, values, 'OR');
  }

  whereNotIn(field, values, conn='AND') {
    this.whereClause.push({
      clause: `${field} NOT IN (${values.map(() => '?').join(', ')})`,
      conn
    });

    this.queryValues = this.queryValues.concat(values);
    
    return this;
  }

  orWhereNotIn(field, values) {
    return this.whereNotIn(field, values, 'OR');
  }

  orWhereNotNull(field) {
    return this.whereNotNull(field, 'OR');
  }

  limit(limit) {
    this.limitClause = limit;
    return this;
  }

  offset(offset) {
    this.offsetClause = offset;
    return this;
  }

  orderBy(field, direction='ASC') {
    this.orderByClause.push({field, direction});
    return this;
  }

  groupBy(...fields) {
    this.groupByClause = this.groupByClause.concat(fields);
    return this;
  }

  async execute() {
    const { query, values } = this.getQuery();
    const [rows, fields] = await app.get('db').execute(query, values);

    return rows;
  }

  getQuery() {
    if (!this.fromClause) {
      throw new Error('From is required');
    }

    let select = '*';

    if (this.selectClause.length > 0) {
      select = this.selectClause.join(', ');
    }

    let query = `SELECT ${select} FROM \`${this.fromClause}\` `;

    query += this.buildJoinForQuery();
    query += this.buildWhereForQuery();
    
    if (this.groupByClause.length > 0) {
      query += ' GROUP BY ' + this.groupByClause.map(column => `${column}`).join(', ');
    }

    query += this.buildOrderByForQuery();

    if (this.limitClause) {
      query += ` LIMIT ${this.limitClause} `;
    }

    return {
      query,
      values: this.queryValues
    };
  }

  buildJoinForQuery() {
    let query = '';

    for (let i = 0; i < this.joinClause.length; i++) {
      if (this.joinClause[i].rawClause) {
        query += this.joinClause[i].rawClause;
      } else {
        query += ` ${this.joinClause[i].direction} JOIN ${this.joinClause[i].table} ON ${this.joinClause[i].field1} ${this.joinClause[i].condition} ${this.joinClause[i].field2} `;
      }

      if (i < this.joinClause.length - 1) {
        query += ' ';
      }
    }

    return query;
  }

  buildWhereForQuery() {
    let query = '';

    if (this.whereClause.length > 0) {
      query += ' WHERE ';

      for (let i = 0; i < this.whereClause.length; i++) {
        query += this.whereClause[i].clause;
  
        if (i < this.whereClause.length - 1) {
          query += ` ${this.whereClause[i].conn} `;
        }
      }
    }

    return query;
  }

  buildOrderByForQuery() {
    let query = '';

    if (this.orderByClause.length > 0) {
      query += ' ORDER BY ';

      for (let i = 0; i < this.orderByClause.length; i++) {
        query += ` \`${this.orderByClause[i].field}\` ${this.orderByClause[i].direction} `;

        if (i < this.orderByClause.length - 1) {
          query += ', ';
        }
      }
    }

    return query;
  }

}