"use strict";

module.exports = function(sequelize, DataTypes) {

  var InterventionNature = sequelize.define('interventionNature', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: "Intervention name must be between 1 and 250 characters in length"
        },
      }
    },
    description: DataTypes.TEXT,
    defaultParamsValue: DataTypes.JSON,
  }, {
    associate: function(models) {

    }
  });
  return InterventionNature;
};
