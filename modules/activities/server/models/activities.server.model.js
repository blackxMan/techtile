"use strict";

module.exports = function(sequelize, DataTypes) {

  var Activity = sequelize.define('activity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: "Activity name must be between 1 and 250 characters in length"
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
    estimatedBudget: DataTypes.DOUBLE,
    realBudget: DataTypes.DOUBLE,
    year: DataTypes.INTEGER,
    paramsValue: DataTypes.JSON,

  }, {
    associate: function(models) {
      Activity.belongsTo(models.user);
      Activity.belongsTo(models.user,{as:'Manager', foreignKey: 'managerId'});
      Activity.hasOne(Activity,{as:'Parent',foreignKey: 'parentId'});
    }
  });
  return Activity;
};
