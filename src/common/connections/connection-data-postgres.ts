//version 1.0.2 2023-02-10 SRODRIGUEZ - agrega conversión de datos PG para que no devuelva decimal como string desde bbdd
//version 1.0.1 2023-01-04 SRODRIGUEZ
import knex from "knex";
import sqlConfig = require("../../config/sql-config.json");

const pg = require('pg');

/*
pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
   return parseInt(value);
});

pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
    return parseFloat(value);
});
*/

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
    return parseFloat(value);
});


let _myPostgresConnection: any;
let _myPostgresConnectionName = "";
let _myPostgresConnectionCentral: any;
let _myPostgresConnectionAdmin: any;

/* eslint max-len: ["error", { "code": 400 }] */
/**
 * @param {string} databaseName
 * @return {string}
   * initialize postgres client
   * export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service/account/key.json
   * export INSTANCE_CONNECTION_NAME='<MY-PROJECT>:<INSTANCE-REGION>:<INSTANCE-NAME>'
   * export DB_USER='my-db-user'
   * export DB_PASS='my-db-pass'
   * export DB_NAME='my_db'
   */
export function db(databaseName: string): any {
  if (_myPostgresConnection && databaseName === _myPostgresConnectionName) {
    return _myPostgresConnection;
  } else if (_myPostgresConnection) {
    _myPostgresConnection.destroy();
  }

  _myPostgresConnectionName = databaseName;
  const dbSocketAddr = (process.env.APP_serverAddress ?? "").split(":"); // e.g. '127.0.0.1:5432'

  // Establish a connection to the database
  _myPostgresConnection =knex({
    client: "pg",
    connection: {
      user: process.env.APP_DB_USER,
      password: process.env.APP_DB_PASS,
      database: databaseName,
      host: dbSocketAddr[0],
      port: Number(dbSocketAddr[1]), // e.g. '5432'
      ssl: { rejectUnauthorized: false },
      /*
        ssl: {
          rejectUnauthorized: false,
          ca: "", //fs.readFileSync(process.env.DB_ROOT_CERT), // e.g., '/path/to/my/server-ca.pem'
          key: "", //fs.readFileSync(process.env.DB_KEY), // e.g. '/path/to/my/client-key.pem'
          cert: "", //fs.readFileSync(process.env.DB_CERT), // e.g. '/path/to/my/client-cert.pem'
        },
        */
    },
    // ... Specify additional properties here.
    ...sqlConfig,
  });

  return _myPostgresConnection;
}


/* eslint max-len: ["error", { "code": 400 }] */
/**
 * @return {string}
   * initialize postgres client
   * export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service/account/key.json
   * export INSTANCE_CONNECTION_NAME='<MY-PROJECT>:<INSTANCE-REGION>:<INSTANCE-NAME>'
   * export DB_USER='my-db-user'
   * export DB_PASS='my-db-pass'
   * export DB_NAME='my_db'
   */
export function dbCentral(): any {
  if (_myPostgresConnectionCentral) {
    return _myPostgresConnectionCentral;
  }

  const dbSocketAddr = (process.env.APP_serverAddress ?? "").split(":"); // e.g. '127.0.0.1:5432'

  // Establish a connection to the database
  _myPostgresConnectionCentral =knex({
    client: "pg",
    connection: {
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASS,
      database: process.env.ADMIN_DB_NAME,
      host: dbSocketAddr[0],
      port: Number(dbSocketAddr[1]), // e.g. '5432'
      ssl: { rejectUnauthorized: false },
      /*
        ssl: {
          rejectUnauthorized: false,
          ca: "", //fs.readFileSync(process.env.DB_ROOT_CERT), // e.g., '/path/to/my/server-ca.pem'
          key: "", //fs.readFileSync(process.env.DB_KEY), // e.g. '/path/to/my/client-key.pem'
          cert: "", //fs.readFileSync(process.env.DB_CERT), // e.g. '/path/to/my/client-cert.pem'
        },
        */
    },
    // ... Specify additional properties here.
    ...sqlConfig,
  });

  return _myPostgresConnectionCentral;
}


/* eslint max-len: ["error", { "code": 400 }] */
/**
 * @return {string}
   * initialize postgres client
   * export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service/account/key.json
   * export INSTANCE_CONNECTION_NAME='<MY-PROJECT>:<INSTANCE-REGION>:<INSTANCE-NAME>'
   * export DB_USER='my-db-user'
   * export DB_PASS='my-db-pass'
   * export DB_NAME='my_db'
   */
export function postgresConnectionAdmin(): any {
  if (_myPostgresConnectionAdmin) {
    return _myPostgresConnectionAdmin;
  }

  const dbSocketAddr = (process.env.ADMIN_serverAddress ?? "").split(":"); // e.g. '127.0.0.1:5432'

  // Establish a connection to the database
  _myPostgresConnectionAdmin =knex({
    client: "pg",
    connection: {
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASS,
      database: process.env.ADMIN_DB_NAME,
      host: dbSocketAddr[0],
      port: Number(dbSocketAddr[1]), // e.g. '5432',
      ssl: { rejectUnauthorized: false },
      /*
        ssl: {
          rejectUnauthorized: false,
          ca: "", //fs.readFileSync(process.env.DB_ROOT_CERT), // e.g., '/path/to/my/server-ca.pem'
          key: "", //fs.readFileSync(process.env.DB_KEY), // e.g. '/path/to/my/client-key.pem'
          cert: "", //fs.readFileSync(process.env.DB_CERT), // e.g. '/path/to/my/client-cert.pem'
        },
        */
    },
    // ... Specify additional properties here.
    ...sqlConfig,
  });

  return _myPostgresConnectionAdmin;
}
