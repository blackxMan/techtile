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
      defaultValue: DataTypes.NOW,
      field: 'start_at'
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'end_at'
    },
    description: DataTypes.TEXT,
    prescriptionId: {
      type:DataTypes.INTEGER,
      field: 'prescription_id'
    },
    prescriptionNature: {
      type:DataTypes.STRING,
      field: 'prescription_nature'
    },
    paramsValue: {
      type: DataTypes.JSON,
      field: 'params_value'
    },
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'interventions',
    associate: function(models) {
      Intervention.belongsTo(models.user);
      Intervention.belongsTo(models.activity);
      Intervention.belongsTo(models.interventionNature);
    }
  });
  return Intervention;
};
