"use strict";

module.exports = function(sequelize, DataTypes) {

  var Intervention = sequelize.define('intervention', {
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
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    description: DataTypes.TEXT,
    prescriptionId: DataTypes.INTEGER,
    prescriptionNature: DataTypes.STRING,
    paramsValue: DataTypes.JSON,
  }, {
    associate: function(models) {
      Intervention.belongsTo(models.user);
      Intervention.belongsTo(models.activity);
    }
  });
  return Intervention;
};
