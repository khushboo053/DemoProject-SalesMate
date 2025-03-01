'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      sales.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      })
    }
  }
  sales.init({
    product_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'sales',
  });
  return sales;
};