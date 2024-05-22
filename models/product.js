'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Order, {
        foreignKey: 'productId',
        as: 'orders'
      });

      Product.hasMany(models.sales, {
        foreignKey: 'product_id',
        as: 'sales'
      });

      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      })

    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    buyPrice: DataTypes.FLOAT,
    sellPrice: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    categoryId: DataTypes.INTEGER,
    image: DataTypes.BLOB,
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};