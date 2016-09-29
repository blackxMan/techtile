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
      defaultValue: DataTypes.NOW
    },
    deathAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    description: DataTypes.TEXT,
    picture: DataTypes.STRING,
    geo: DataTypes.JSON,
    color: DataTypes.STRING,
    maxWeight: DataTypes.INTEGER,
    minWeight: DataTypes.INTEGER,
    minHeight: DataTypes.INTEGER,
    maxHeight: DataTypes.INTEGER,
    heightMeasureUnit: DataTypes.STRING,
    weightMeasureUnit: DataTypes.STRING,
    plantDensitySurfaceUnit: DataTypes.STRING,
    plantDensitySurfaceValue: DataTypes.DOUBLE,
    plantDensityWeightUnit: DataTypes.STRING,
    plantDensityWeightValue: DataTypes.DOUBLE,

  }, {
    associate: function(models) {
      Product.belongsTo(models.activity,{as:'Mother',foreignKey:'motherId'});
      Product.belongsTo(models.activity,{as:'Father',foreignKey:'fatherId'});
      Product.hasMany(models.activity);
      Product.belongsTo(models.user);
    }
  });
  return Product;
};
