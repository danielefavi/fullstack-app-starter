import mysql2 from 'mysql2/promise';

export default class DB {
  db = null;
  mysqlConfig = null;

  constructor(mysqlConfig) {
    this.mysqlConfig = mysqlConfig;
    this.init();
  }

  async execute(query, params=null) {
    return await this.db.execute(query, params);
  }

  async init() {
    this.db = await mysql2.createConnection(this.mysqlConfig);
  }

  async close() {
    await this.db.end();
  }

  async columnExists(tableName, columnName) {
    const query = `
      SELECT COUNT(*) AS columnExists
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
    `;

    const [rows, fields] = await this.db.execute(query, [tableName, columnName]);

    return (rows[0].columnExists > 0);
  }

}