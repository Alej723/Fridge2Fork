const mockRecipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "https://spoonacular.com/recipeImages/1-312x231.jpg",
    readyInMinutes: 30,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    extendedIngredients: [
      { id: 1, name: "spaghetti", original: "200g spaghetti", unit: "g" },
      { id: 2, name: "eggs", original: "2 large eggs", unit: "piece" },
      { id: 3, name: "bacon", original: "100g bacon", unit: "g" },
      { id: 4, name: "parmesan cheese", original: "50g parmesan", unit: "g" },
      { id: 5, name: "garlic", original: "2 cloves garlic", unit: "cloves" }
    ],
    instructions: "1. Cook spaghetti according to package directions...",
    usedIngredientCount: 2,
    missedIngredientCount: 3
  },
  {
    id: 2,
    title: "Vegetable Stir Fry",
    image: "https://spoonacular.com/recipeImages/2-312x231.jpg",
    readyInMinutes: 20,
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 6, name: "broccoli", original: "1 head broccoli", unit: "head" },
      { id: 7, name: "carrots", original: "2 carrots", unit: "piece" },
      { id: 8, name: "bell pepper", original: "1 bell pepper", unit: "piece" },
      { id: 9, name: "soy sauce", original: "2 tbsp soy sauce", unit: "tbsp" },
      { id: 10, name: "garlic", original: "3 cloves garlic", unit: "cloves" }
    ],
    instructions: "1. Chop all vegetables into bite-sized pieces...",
    usedIngredientCount: 1,
    missedIngredientCount: 4
  },
  {
    id: 3,
    title: "Chicken Salad (Halal)",
    image: "https://spoonacular.com/recipeImages/3-312x231.jpg",
    readyInMinutes: 15,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    extendedIngredients: [
      { id: 11, name: "chicken breast", original: "2 chicken breasts", unit: "piece" },
      { id: 12, name: "lettuce", original: "1 head lettuce", unit: "head" },
      { id: 13, name: "tomato", original: "2 tomatoes", unit: "piece" },
      { id: 14, name: "cucumber", original: "1 cucumber", unit: "piece" }
    ],
    instructions: "1. Grill chicken until cooked through...",
    usedIngredientCount: 1,
    missedIngredientCount: 3
  }
];

module.exports = mockRecipes;