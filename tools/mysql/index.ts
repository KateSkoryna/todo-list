import * as fs from 'fs';
import * as mysql from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

const [, user, password, host, , database] = process.env.DATABASE_URL?.match(
  /mysql:\/\/([^:]+):([^@]+)@([^:]+):([^\/]+)\/(.*)/
)!;

const connection = mysql.createConnection({
  host,
  user,
  password,
  multipleStatements: true,
});

function main() {
  connection.connect();
  seed();
  console.log(`${database} successfully created`);
}

function seed() {
  process.chdir('tools/mysql');
  const sql = fs.readFileSync('./seed.sql').toString();
  execute(sql + '\n');
}

function execute(sql: string) {
  sql.split(';\n')
    // remove comments
    .map(x => x.replace(/^---.*$/, '').replace(/^#.*$/, ''))
    // remove empty statements
    .filter(s => /\w/.test(s));
  connection.query(sql, null, err => {
    if (err) {
      throw err;
    }
    connection.end();
  });
}

main();
