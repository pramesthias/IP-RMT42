'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Recipe.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    prepareTime: DataTypes.STRING,
    cookTime: DataTypes.STRING,
    ingredients: DataTypes.ARRAY(DataTypes.TEXT),
    steps: DataTypes.ARRAY(DataTypes.TEXT),
    nutrients: DataTypes.JSON,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};