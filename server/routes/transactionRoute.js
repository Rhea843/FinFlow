import express from 'express'
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect) //all transaction routes are protected

router.post('/', createTransaction)
router.get('/', getTransactions)
router.get('/:id', getTransaction)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

export default router