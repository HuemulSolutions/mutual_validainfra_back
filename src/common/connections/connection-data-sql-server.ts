//version 1.0.1 2023-01-04 SRODRIGUEZ
import knex from "knex";
import sqlConfig = require("../../config/sql-config.json");



let _mySqlServerConnection: any;
let _mySqlServerConnectionName = "";
let _mySqlServerConnectionCentral: any;
let _mySqlServerConnectionAdmin: any;

/* eslint max-len: ["error", { "code": 400 }] */
/**
 * @param {string} databaseName
 * @return {string}
   * initialize SqlServer client
   * export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service/account/key.json
   * export INSTANCE_CONNECTION_NAME='<MY-PROJECT>:<INSTANCE-REGION>:<INSTANCE-NAME>'
   * export DB_USER='my-db-user'
   * export DB_PASS='my-db-pass'
   * export DB_NAME='my_db'
   */
export function db(databaseName: string): any {
  if (_mySqlServerConnection && databaseName === _mySqlServerConnectionName) {
    return _mySqlServerConnection;
  } else if (_mySqlServerConnection) {
    _mySqlServerConnection.destroy();
  }

  _mySqlServerConnectionName = databaseName;
  const dbSocketAddr = (process.env.APP_serverAddress ?? "").split(":"); // e.g. '127.0.0.1:5432'

  // Establish a connection to the database
  _mySqlServerConnection =knex({
    client: "mssql",
    connection: {
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASS,
      // database: databaseName,
      database: process.env.ADMIN_DB_NAME,
      server: dbSocketAddr[0],
      port: Number(dbSocketAddr[1]), // e.g. '5432'
      ...sqlConfig,
    },
    // ... Specify additional properties here.

  });

  return _mySqlServerConnection;
}


/* eslint max-len: ["error", { "code": 400 }] */
/**
 * @return {string}
   * initialize SqlServer client
   * export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service/account/key.json
   * export INSTANCE_CONNECTION_NAME='<MY-PROJECT>:<INSTANCE-REGION>:<INSTANCE-NAME>'
   * export DB_USER='my-db-user'
   * export DB_PASS='my-db-pass'
   * export DB_NAME='my_db'
   */
export function dbCentral(): any {
  if (_mySqlServerConnectionCentral) {
    return _mySqlServerConnectionCentral;
  }

  const dbSocketAddr = (process.env.APP_serverAddress ?? "").split(":"); // e.g. '127.0.0.1:5432'

  // Establish a connection to the database
  _mySqlServerConnectionCentral =knex({
    client: "mssql",
    connection: {
      user: process.env.APP_DB_USER,
      password: process.env.APP_DB_PASS,
      database: process.env.APP_DB_NAME,
      server: dbSocketAddr[0],
      port: Number(dbSocketAddr[1]), // e.g. '5432'
      ...sqlConfig,
    },
    // ... Specify additional properties here.
  });

  return _mySqlServerConnectionCentral;
}


/* eslint max-len: ["error", { "code": 400 }] */
/**
 * @return {string}
   * initialize SqlServer client
   * export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service/account/key.json
   * export INSTANCE_CONNECTION_NAME='<MY-PROJECT>:<INSTANCE-REGION>:<INSTANCE-NAME>'
   * export DB_USER='my-db-user'
   * export DB_PASS='my-db-pass'
   * export DB_NAME='my_db'
   */
export function SqlServerConnectionAdmin(): any {
  if (_mySqlServerConnectionAdmin) {
    return _mySqlServerConnectionAdmin;
  }

  const dbSocketAddr = (process.env.ADMIN_serverAddress ?? "").split(":"); // e.g. '127.0.0.1:5432'

  // Establish a connection to the database
  _mySqlServerConnectionAdmin =knex({
    client: "mssql",
    connection: {
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASS,
      database: process.env.ADMIN_DB_NAME,
      server: dbSocketAddr[0],
      port: Number(dbSocketAddr[1]), // e.g. '5432'
      ...sqlConfig,
    },
    // ... Specify additional properties here.
  });

  return _mySqlServerConnectionAdmin;
}
