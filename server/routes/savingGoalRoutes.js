import express from 'express'
import { getSavingTransactions } from '../controllers/savingTransactionController.js'
import { createGoal, getGoals, getGoal, addToGoal, updateGoal, deleteGoal, withdrawFromGoal } from '../controllers/savingGoalController.js'
import protect from '../middleware/authMiddleware.js';

const router = express.Router()

router.use(protect)

router.post('/', createGoal)
router.get('/saving-transactions', getSavingTransactions)
router.get('/', getGoals)
router.get('/:id', getGoal)
router.patch('/:id/add', addToGoal)
router.put('/:id', updateGoal)
router.delete('/:id', deleteGoal)
router.patch("/:id/withdraw", withdrawFromGoal);

export default router