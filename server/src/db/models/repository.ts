'use strict';
export {};
const { Model, DataTypes, UUIDV4 } = require('sequelize');

export = class Repository extends Model {
  id!         : string;
  ownerName!  : string;
  projectName!: string;
  url!        : string;
  starCount!  : number;
  forkCount!  : number;
  issueCount! : number;
  creationDate!:number;

  getSanitized () {
    const {
      updatedAt,
      createdAt,
      ...sanitized
    } = this.toJSON();

    return sanitized;
  }

  static _initialize (sequelize) {
    this.init({
      id         : {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      ownerName  : DataTypes.STRING(256),
      projectName: DataTypes.STRING(256),
      url        : DataTypes.STRING(256),
      starCount  : DataTypes.INTEGER,
      forkCount  : DataTypes.INTEGER,
      issueCount : DataTypes.INTEGER,
      creationDate: DataTypes.DATE
    }, {
      sequelize
    });
  }
};
