"use strict";

module.exports = function(sequelize, DataTypes) {

  var Parcel = sequelize.define('parcel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: "Parcel name must be between 1 and 250 characters in length"
        },
      }
    },
    bornAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deathAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    description: DataTypes.TEXT,
    geo: DataTypes.JSON,
    shapeForm: DataTypes.JSON,
    color: DataTypes.STRING,
    state: DataTypes.STRING,
    surfaceUnit: DataTypes.STRING,
    surfaceValue: DataTypes.DOUBLE,

  }, {
    associate: function(models) {
      Parcel.belongsTo(models.user);
    }
  });
  return Parcel;
};
