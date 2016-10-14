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
      defaultValue: DataTypes.NOW,
      field: 'start_at'
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'end_at'
    },
    description: {
      type: DataTypes.TEXT,
      field: 'description'
    },
    estimatedBudget: {
      type: DataTypes.DOUBLE,
      field: 'estimated_budget'
    },
    realBudget:  {
      type: DataTypes.DOUBLE,
      field: 'real_budget'
    },
    year: DataTypes.INTEGER,
    paramsValue: {
      type: DataTypes.JSON,
      field: 'params_value'
    },

  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'activities',
    associate: function(models) {
      Activity.belongsTo(models.user);
      Activity.belongsTo(models.user,{as:'Manager', foreignKey: 'manager_id'});
      Activity.belongsTo(models.product,{as:'Product', foreignKey: 'product_id'});
      Activity.hasOne(Activity,{as:'Parent',foreignKey: 'parent_id'});
    }
  });
  return Activity;
};
