import express from "express";
import { getSavingTransactions } from "../controllers/SavingTransactionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect)

router.get("/", getSavingTransactions);

export default router;