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

exports.init = async () => {

  const sequelize = new Sequelize(config.get('connectionString'), {
    define: {
      freezeTableName: true
    }
  });

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