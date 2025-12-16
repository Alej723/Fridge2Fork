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
    id: 9,
    title: "Falafel Wrap",
    image: "https://spoonacular.com/recipeImages/9-312x231.jpg",
    readyInMinutes: 25,
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 42, name: "chickpeas", original: "400g chickpeas", unit: "g" },
      { id: 43, name: "parsley", original: "1 bunch parsley", unit: "bunch" },
      { id: 44, name: "cumin", original: "1 tsp cumin", unit: "tsp" },
      { id: 45, name: "pita bread", original: "4 pita breads", unit: "piece" },
      { id: 46, name: "lettuce", original: "1 head lettuce", unit: "head" }
    ],
    instructions: "1. Blend chickpeas with herbs and spices...",
    usedIngredientCount: 1,
    missedIngredientCount: 4
  },
  // Add a Halal-friendly recipe
  {
    id: 10,
    title: "Chicken Shawarma",
    image: "https://spoonacular.com/recipeImages/10-312x231.jpg",
    readyInMinutes: 40,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 47, name: "chicken breast", original: "500g chicken breast", unit: "g" },
      { id: 48, name: "yogurt", original: "200g yogurt", unit: "g" },
      { id: 49, name: "garlic", original: "4 cloves garlic", unit: "cloves" },
      { id: 50, name: "cumin", original: "1 tbsp cumin", unit: "tbsp" },
      { id: 51, name: "pita bread", original: "4 pita breads", unit: "piece" }
    ],
    instructions: "1. Marinate chicken in yogurt and spices...",
    usedIngredientCount: 1,
    missedIngredientCount: 4
  }
];