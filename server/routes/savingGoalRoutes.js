import express from 'express'
import { createGoal, getGoals, getGoal, addToGoal, updateGoal, deleteGoal } from '../controllers/savingGoalController.js'
import protect from '../middleware/authMiddleware.js';

const router = express.Router()

router.use(protect)

router.post('/', createGoal)
router.get('/', getGoals)
router.get('/:id', getGoal)
router.patch('/:id/add', addToGoal)
router.put('/:id', updateGoal)
router.delete('/:id', deleteGoal)

export default router