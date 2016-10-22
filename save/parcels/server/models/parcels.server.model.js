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
      defaultValue: DataTypes.NOW,
      field: 'born_at'
    },
    deathAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: 'death_at'
    },
    description: DataTypes.TEXT,
    geo: DataTypes.JSON,
    shapeForm: {
      type: DataTypes.JSON,
      field: 'shape_form'
    },
    color: DataTypes.STRING,
    state: DataTypes.STRING,
    surfaceUnit: {
      type: DataTypes.STRING,
      field: 'surface_unit'
    },
    surfaceValue: {
      type:DataTypes.DOUBLE,
      field: 'surface_value'
    },

  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'parcels',
    associate: function(models) {
      Parcel.belongsTo(models.user);
    }
  });
  return Parcel;
};
