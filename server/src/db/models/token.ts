'use strict';
export {};
const { Model, DataTypes, UUIDV4 } = require('sequelize');
const config = require('config');

module.exports = class Token extends Model {
  id!: string;
  validUntil!: Date;

  static _initialize (sequelize) {
    this.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue () {
          return Date.now() + config.tokenExpireTime * 1000
        }
      }
    }, {
      sequelize
    });
  }
};