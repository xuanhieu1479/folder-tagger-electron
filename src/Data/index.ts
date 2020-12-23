import fs from 'fs';
import Database from 'better-sqlite3';
import { createConnection } from 'typeorm';
import ormConfig from '../common/Config/ormconfig';
import { DATABASE_DIRECTORY, DATABASE_PATH } from '../common/Variables/data';
import { User } from './entity/User';

const initDatabase = () => {
  if (!fs.existsSync(DATABASE_DIRECTORY)) fs.mkdirSync(DATABASE_DIRECTORY);
  new Database(DATABASE_PATH, { verbose: console.log });
};

const testingDB = () => {
  createConnection(ormConfig)
    .then(async connection => {
      console.log('Inserting a new user into the database...');
      console.log(connection.options.entities);
      const user = new User();
      user.firstName = 'Timber';
      user.lastName = 'Saw';
      user.age = 25;
      await connection.manager.save(user);
      console.log('Saved a new user with id: ' + user.id);

      console.log('Loading users from the database...');
      const users = await connection.manager.find(User);
      console.log('Loaded users: ', users);

      console.log(
        'Here you can setup and run express/koa/any other framework.'
      );
    })
    .catch(error => console.log(error));
};

initDatabase();
testingDB();
