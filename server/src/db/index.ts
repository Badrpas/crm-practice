const { Sequelize } = require('sequelize');
const User = require('./models/user');
const Repository = require('./models/repository');
const Token = require('./models/token');
const config = require('config');

const initializeModels = (sequelize) => {
  return (...models) => {
    models.forEach(Model => {
      Model._initialize(sequelize);
    });
  };
};

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const SLEEP_TIME = 4000;
let retryCount = 5;

exports.init = async () => {

  const sequelize = new Sequelize(config.get('connectionString'), {
    define: {
      freezeTableName: true
    }
  });

  await (async function waitForConnection() {
    try {
      await sequelize.authenticate();
    } catch (err) {
      if (retryCount--) {
        console.log('Error while initializing Sequelize. Retrying...');
        await sleep(SLEEP_TIME);
        return waitForConnection();
      }

      throw err;
    }
  })();
  
  initializeModels(sequelize)
    (User, Token, Repository);

  User.hasOne(Token);
  Token.belongsTo(User);
  User.hasMany(Repository);
  Repository.belongsToMany(User, { through: 'UserToRepo' });

  await sequelize.sync({
    force: true
  });

  await User.create({
    email: 'q@q.com',
    password: 'qwe'
  });

  console.log('DB initialized.');

};