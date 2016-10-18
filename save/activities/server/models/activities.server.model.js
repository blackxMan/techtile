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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
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
    timestamps: false,
    tableName: 'activities',
    associate: function(models) {
      Activity.belongsTo(models.user);
      Activity.belongsTo(models.user,{as:'manager', foreignKey: 'manager_id'});
      Activity.belongsTo(models.product,{as:'product', foreignKey: 'product_id'});
      Activity.belongsTo(Activity,{as:'parent',foreignKey: 'parent_id'});
    }
  });
  return Activity;
};
