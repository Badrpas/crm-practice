'use strict';
export {};
const { Model, DataTypes, UUIDV4 } = require('sequelize');

module.exports = class User extends Model {
  id!: string;
  email: string;
  password: string;

  static _initialize (sequelize) {
    this.init({
      id   : {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      email: {
        type    : DataTypes.STRING(256),
        allowNull: false,
        validate: { isEmail: true }
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: false,
      }
    }, {
      sequelize
    });
  }
};