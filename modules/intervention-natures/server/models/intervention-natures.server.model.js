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
    defaultParamsValue: {
      type: DataTypes.JSON,
      field: 'default_params_value'
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'intervention_natures',
    associate: function(models) {
      InterventionNature.belongsTo(models.user);
    }
  });
  return InterventionNature;
};
