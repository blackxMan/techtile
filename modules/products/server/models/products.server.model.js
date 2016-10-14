"use strict";

module.exports = function(sequelize, DataTypes) {

  var Product = sequelize.define('product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: "Product name must be between 1 and 250 characters in length"
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'death_at'
    },
    description: DataTypes.TEXT,
    picture: DataTypes.STRING,
    geo: DataTypes.JSON,
    color: DataTypes.STRING,
    maxWeight: {
      type:DataTypes.INTEGER,
      field: 'max_weight'
    },
    minWeight: {
      type:DataTypes.INTEGER,
      field: 'min_weight'
    },
    minHeight: {
      type:DataTypes.INTEGER,
      field: 'min_height'
    },
    maxHeight: {
      type:DataTypes.INTEGER,
      field: 'max_height'
    },
    heightMeasureUnit: {
      type:DataTypes.STRING,
      field: 'height_measure_unit'
    },
    weightMeasureUnit: {
      type:DataTypes.STRING,
      field: 'weight_measure_unit'
    },
    plantDensitySurfaceUnit: {
      type:DataTypes.STRING,
      field: 'plant_density_surface_unit'
    },
    plantDensitySurfaceValue: {
      type:DataTypes.DOUBLE,
      field:'plant_density_surface_value'
    },
    plantDensityWeightUnit: {
      type:DataTypes.STRING,
      field: 'plant_density_weight_unit'
    },
    plantDensityWeightValue: {
      type:DataTypes.DOUBLE,
      field: 'plant_density_weight_value'
    }

  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'products',
    associate: function(models) {
      Product.belongsTo(models.product,{as:'Mother',foreignKey:'mother_id'});
      Product.belongsTo(models.product,{as:'Father',foreignKey:'father_id'});
      Product.hasMany(models.activity);
      Product.belongsTo(models.user);
    }
  });
  return Product;
};
