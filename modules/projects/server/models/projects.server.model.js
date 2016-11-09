"use strict";

module.exports = function(sequelize, DataTypes) {

  var Project = sequelize.define('project', {
    commandReference: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 30],
          msg: "Project name must be between 1 and 30 characters in length"
        },
      },
      field: 'command_reference'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: "Project name must be between 1 and 250 characters in length"
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
    plannedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'planned_at'
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'delivered_at'
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
    note: {
      type: DataTypes.TEXT,
      field: 'note'
    },
    estimatedBudget: {
      type: DataTypes.DOUBLE,
      field: 'estimated_budget'
    },
    clientBudget: {
      type: DataTypes.DOUBLE,
      field: 'client_budget'
    },
    budget:  {
      type: DataTypes.DOUBLE,
      field: 'budget'
    },
    state:{
      type: DataTypes.ENUM('WAITING','ACTIVE','CLOSE','SUSPEND'),
      field: 'state'
    }

  }, {
    underscored: true,
    freezeTableName: true,
    timestamps: false,
    tableName: 'projects',
    associate: function(models) {
      Project.belongsTo(models.user);
    }
  });
  return Project;
};
