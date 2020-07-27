/* eslint-disable no-console */
const mysql = require('mysql2');
const path = require('path');

const args = process.argv.slice(2)[0];

const envFile = args === 'test' ? '../.env.test' : '../.env';

require('dotenv').config({
  path: path.join(__dirname, envFile),
});
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, CLEARDB_DATABASE_URL } = process.env;

const connection = CLEARDB_DATABASE_URL ?
  mysql.createConnection(CREATE_DATABASE_URL) :
  mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
  if (err) {
    console.log(`Your environment variables might be wrong. Please double check .env file`);
    console.log('Environment Variables are:', { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT });
    console.log(err);
  }
  connection.close();
});
