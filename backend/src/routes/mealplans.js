const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCurrentMealPlan, updateMealPlan } = require('../controllers/mealPlanController');

router.use(protect);

router.get('/current', getCurrentMealPlan);
router.put('/', updateMealPlan);

module.exports = router;