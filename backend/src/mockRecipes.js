const mockRecipes = [
  {
    id: 101,
    title: "Chicken Fried Rice",
    image: "https://spoonacular.com/recipeImages/101-312x231.jpg",
    readyInMinutes: 25,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 1, name: "chicken", original: "2 chicken breasts", unit: "piece" },
      { id: 2, name: "rice", original: "2 cups cooked rice", unit: "cups" },
      { id: 3, name: "eggs", original: "2 eggs", unit: "piece" },
      { id: 4, name: "carrots", original: "1 carrot", unit: "piece" },
      { id: 5, name: "peas", original: "1/2 cup peas", unit: "cup" },
      { id: 6, name: "soy sauce", original: "2 tbsp soy sauce", unit: "tbsp" }
    ],
    instructions: "1. Cook chicken and shred. 2. Scramble eggs and set aside. 3. Stir-fry vegetables. 4. Add rice, chicken, eggs, and soy sauce. 5. Mix well and serve hot.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 102,
    title: "Vegetable Stir Fry",
    image: "https://spoonacular.com/recipeImages/102-312x231.jpg",
    readyInMinutes: 20,
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 7, name: "broccoli", original: "1 head broccoli", unit: "head" },
      { id: 8, name: "carrots", original: "2 carrots", unit: "piece" },
      { id: 9, name: "bell pepper", original: "1 bell pepper", unit: "piece" },
      { id: 10, name: "soy sauce", original: "2 tbsp soy sauce", unit: "tbsp" },
      { id: 11, name: "garlic", original: "3 cloves garlic", unit: "cloves" },
      { id: 12, name: "ginger", original: "1 tbsp ginger", unit: "tbsp" }
    ],
    instructions: "1. Chop vegetables. 2. Heat oil in wok. 3. Stir-fry vegetables starting with hardest. 4. Add garlic, ginger, soy sauce. 5. Serve over rice.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 103,
    title: "Pasta with Tomato Sauce",
    image: "https://spoonacular.com/recipeImages/103-312x231.jpg",
    readyInMinutes: 30,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    extendedIngredients: [
      { id: 13, name: "pasta", original: "200g pasta", unit: "g" },
      { id: 14, name: "tomatoes", original: "4 tomatoes", unit: "piece" },
      { id: 15, name: "onion", original: "1 onion", unit: "piece" },
      { id: 16, name: "garlic", original: "2 cloves garlic", unit: "cloves" },
      { id: 17, name: "cheese", original: "50g parmesan", unit: "g" },
      { id: 18, name: "basil", original: "handful fresh basil", unit: "handful" }
    ],
    instructions: "1. Cook pasta. 2. Make tomato sauce with onions, garlic, tomatoes. 3. Combine pasta and sauce. 4. Top with cheese and basil.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 104,
    title: "Bean Burritos (Vegetarian)",
    image: "https://spoonacular.com/recipeImages/104-312x231.jpg",
    readyInMinutes: 15,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    extendedIngredients: [
      { id: 19, name: "tortillas", original: "4 tortillas", unit: "piece" },
      { id: 20, name: "beans", original: "1 can beans", unit: "can" },
      { id: 21, name: "cheese", original: "100g cheese", unit: "g" },
      { id: 22, name: "lettuce", original: "1 head lettuce", unit: "head" },
      { id: 23, name: "tomato", original: "1 tomato", unit: "piece" },
      { id: 24, name: "sour cream", original: "4 tbsp sour cream", unit: "tbsp" }
    ],
    instructions: "1. Heat beans. 2. Warm tortillas. 3. Fill with beans, cheese, lettuce, tomato. 4. Top with sour cream. 5. Roll up and serve.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 105,
    title: "Grilled Salmon with Vegetables",
    image: "https://spoonacular.com/recipeImages/105-312x231.jpg",
    readyInMinutes: 25,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    extendedIngredients: [
      { id: 25, name: "salmon", original: "2 salmon fillets", unit: "piece" },
      { id: 26, name: "asparagus", original: "1 bunch asparagus", unit: "bunch" },
      { id: 27, name: "lemon", original: "1 lemon", unit: "piece" },
      { id: 28, name: "olive oil", original: "2 tbsp olive oil", unit: "tbsp" },
      { id: 29, name: "garlic", original: "2 cloves garlic", unit: "cloves" },
      { id: 30, name: "herbs", original: "fresh herbs", unit: "handful" }
    ],
    instructions: "1. Season salmon. 2. Grill salmon and asparagus. 3. Make lemon garlic sauce. 4. Serve with lemon wedges.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 106,
    title: "Chicken Curry (Halal)",
    image: "https://spoonacular.com/recipeImages/106-312x231.jpg",
    readyInMinutes: 40,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    extendedIngredients: [
      { id: 31, name: "chicken", original: "500g chicken", unit: "g" },
      { id: 32, name: "onion", original: "1 onion", unit: "piece" },
      { id: 33, name: "curry powder", original: "2 tbsp curry powder", unit: "tbsp" },
      { id: 34, name: "coconut milk", original: "1 can coconut milk", unit: "can" },
      { id: 35, name: "potatoes", original: "2 potatoes", unit: "piece" },
      { id: 36, name: "carrots", original: "2 carrots", unit: "piece" }
    ],
    instructions: "1. Brown chicken. 2. Cook onions and spices. 3. Add vegetables and coconut milk. 4. Simmer until tender. 5. Serve with rice.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 107,
    title: "Vegetable Soup (Vegan)",
    image: "https://spoonacular.com/recipeImages/107-312x231.jpg",
    readyInMinutes: 45,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    extendedIngredients: [
      { id: 37, name: "potatoes", original: "3 potatoes", unit: "piece" },
      { id: 38, name: "carrots", original: "2 carrots", unit: "piece" },
      { id: 39, name: "onion", original: "1 onion", unit: "piece" },
      { id: 40, name: "celery", original: "2 stalks celery", unit: "stalks" },
      { id: 41, name: "vegetable broth", original: "1L vegetable broth", unit: "L" },
      { id: 42, name: "herbs", original: "mixed herbs", unit: "tsp" }
    ],
    instructions: "1. Chop vegetables. 2. Sauté onions. 3. Add all vegetables and broth. 4. Simmer 30 minutes. 5. Season and serve.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 108,
    title: "Falafel Wrap (Vegan, Halal)",
    image: "https://spoonacular.com/recipeImages/108-312x231.jpg",
    readyInMinutes: 30,
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 43, name: "chickpeas", original: "400g chickpeas", unit: "g" },
      { id: 44, name: "parsley", original: "1 bunch parsley", unit: "bunch" },
      { id: 45, name: "cilantro", original: "1 bunch cilantro", unit: "bunch" },
      { id: 46, name: "cumin", original: "1 tsp cumin", unit: "tsp" },
      { id: 47, name: "pita bread", original: "4 pita breads", unit: "piece" },
      { id: 48, name: "lettuce", original: "1 head lettuce", unit: "head" }
    ],
    instructions: "1. Blend chickpeas with herbs. 2. Form patties and fry. 3. Warm pita. 4. Fill with falafel and vegetables. 5. Serve with tahini.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 109,
    title: "Beef and Broccoli",
    image: "https://spoonacular.com/recipeImages/109-312x231.jpg",
    readyInMinutes: 30,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: true,
    extendedIngredients: [
      { id: 49, name: "beef", original: "500g beef strips", unit: "g" },
      { id: 50, name: "broccoli", original: "1 head broccoli", unit: "head" },
      { id: 51, name: "soy sauce", original: "3 tbsp soy sauce", unit: "tbsp" },
      { id: 52, name: "garlic", original: "4 cloves garlic", unit: "cloves" },
      { id: 53, name: "ginger", original: "1 tbsp ginger", unit: "tbsp" },
      { id: 54, name: "cornstarch", original: "1 tbsp cornstarch", unit: "tbsp" }
    ],
    instructions: "1. Marinate beef. 2. Stir-fry beef until browned. 3. Add broccoli and stir-fry. 4. Make sauce with soy sauce, garlic, ginger. 5. Thicken with cornstarch.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 110,
    title: "Greek Yogurt Parfait",
    image: "https://spoonacular.com/recipeImages/110-312x231.jpg",
    readyInMinutes: 5,
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    extendedIngredients: [
      { id: 55, name: "greek yogurt", original: "2 cups greek yogurt", unit: "cups" },
      { id: 56, name: "granola", original: "1 cup granola", unit: "cup" },
      { id: 57, name: "berries", original: "1 cup mixed berries", unit: "cup" },
      { id: 58, name: "honey", original: "2 tbsp honey", unit: "tbsp" }
    ],
    instructions: "1. Layer yogurt in glass. 2. Add granola. 3. Add berries. 4. Drizzle with honey. 5. Repeat layers.",
    usedIngredientCount: 0,
    missedIngredientCount: 4
  },
  {
    id: 111,
    title: "Shrimp Scampi",
    image: "https://spoonacular.com/recipeImages/111-312x231.jpg",
    readyInMinutes: 20,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    extendedIngredients: [
      { id: 59, name: "shrimp", original: "500g shrimp", unit: "g" },
      { id: 60, name: "pasta", original: "200g pasta", unit: "g" },
      { id: 61, name: "garlic", original: "5 cloves garlic", unit: "cloves" },
      { id: 62, name: "butter", original: "4 tbsp butter", unit: "tbsp" },
      { id: 63, name: "lemon", original: "1 lemon", unit: "piece" },
      { id: 64, name: "parsley", original: "handful parsley", unit: "handful" }
    ],
    instructions: "1. Cook pasta. 2. Sauté shrimp in butter and garlic. 3. Add lemon juice. 4. Toss with pasta. 5. Garnish with parsley.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  },
  {
    id: 112,
    title: "Quinoa Salad (Vegan, Gluten-Free)",
    image: "https://spoonacular.com/recipeImages/112-312x231.jpg",
    readyInMinutes: 25,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    extendedIngredients: [
      { id: 65, name: "quinoa", original: "1 cup quinoa", unit: "cup" },
      { id: 66, name: "cucumber", original: "1 cucumber", unit: "piece" },
      { id: 67, name: "tomato", original: "2 tomatoes", unit: "piece" },
      { id: 68, name: "red onion", original: "1/2 red onion", unit: "piece" },
      { id: 69, name: "lemon", original: "1 lemon", unit: "piece" },
      { id: 70, name: "olive oil", original: "3 tbsp olive oil", unit: "tbsp" }
    ],
    instructions: "1. Cook quinoa. 2. Chop vegetables. 3. Mix quinoa with vegetables. 4. Make lemon-olive oil dressing. 5. Toss and serve.",
    usedIngredientCount: 0,
    missedIngredientCount: 6
  }
];

module.exports = mockRecipes;