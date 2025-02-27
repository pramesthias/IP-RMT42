const axios = require('axios');
const { Recipe } = require("../models");  //DEVELOPMENT

module.exports = class RecipeController {

  static async recipes(req, res, next) {

    const { search, filter, page = 1 } = req.query;

    const options = {
      method: 'GET',
      url: 'https://low-carb-recipes.p.rapidapi.com/search',
      params: {
        maxPrepareTime: '10',
        maxCookTime: '20',
        maxCalories: '500',
        maxNetCarbs: '5',
        maxSugar: '3',
        maxAddedSugar: '0',
        limit: '20'
      },
      headers: {
        'X-RapidAPI-Key': `${process.env.RECIPES_API_KEY}`,
        'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com'
      }
    };

    if (search) {
      options.params.name = search;
    }

    if (filter) {
      options.params.includeIngredients = filter.slice(',').join(';');
      console.log(options.params.includeIngredients)
    }

    try {
      const response = await axios.request(options);
      const recipes = response.data;
      const mappedRecipes = recipes.map((recipe, index) => {
        return {
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          prepareTime: `${recipe.prepareTime} minutes`,
          cookTime: `${recipe.cookTime} minutes`,
          ingredients: recipe.ingredients.map(ingredient => `${ingredient.name} ${ingredient.servingSize.desc}`),
          steps: recipe.steps,
          nutrients: {
            caloriesKCal: recipe.nutrients.caloriesKCal,
            totalCarbs: recipe.nutrients.totalCarbs,
            sugar: recipe.nutrients.sugar,
            protein: recipe.nutrients.protein,
            fat: recipe.nutrients.fat,
            cholesterol: recipe.nutrients.cholesterol,
            alcohol: recipe.nutrients.alcohol,
            gluten: recipe.nutrients.gluten,
          },
          image: recipe.image,
        }
      })

      const lim = 8
      const offset = 8 * (page - 1)
      const total = recipes.length;
      const totalPage = Math.ceil(total / 8)
      const results = mappedRecipes.slice(offset, offset + lim)

      res.status(200).json({
        total,
        totalPage,
        results,
      });

    } catch (error) {
      next(error);
      console.log(error)
    }
  }


  static async recipeById(req, res, next) {

    const { id } = req.params

    const options = {
      method: 'GET',
      url: `https://low-carb-recipes.p.rapidapi.com/recipes/${id}`,
      headers: {
        'X-RapidAPI-Key': `${process.env.RECIPES_API_KEY}`,
        'X-RapidAPI-Host': 'low-carb-recipes.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const recipe = response.data;

      res.status(200).json({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        prepareTime: `${recipe.prepareTime} minutes`,
        cookTime: `${recipe.cookTime} minutes`,
        ingredients: recipe.ingredients.map(ingredient => `${ingredient.name} ${ingredient.servingSize.desc}`),
        steps: recipe.steps,
        nutrients: {
          caloriesKCal: recipe.nutrients.caloriesKCal,
          totalCarbs: recipe.nutrients.totalCarbs,
          sugar: recipe.nutrients.sugar,
          protein: recipe.nutrients.protein,
          fat: recipe.nutrients.fat,
          cholesterol: recipe.nutrients.cholesterol,
          alcohol: recipe.nutrients.alcohol,
          gluten: recipe.nutrients.gluten,
        },
        image: recipe.image,
      });

    } catch (error) {
      next(error);
    }
  }


}