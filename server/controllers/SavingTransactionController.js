import savingTransaction from "../models/savingTransaction.js";
import SavingGoal from "../models/savingGoal.js";

export const getSavingTransactions = async (req, res) => {
  console.log('getSavingTransactions hit, user:', req.user.id)
  try {
    const transactions = await savingTransaction.find({
      user: req.user.id,
    })
      .populate("goal")
      .sort({ createdAt: -1 });
     console.log('found transactions:', transactions.length)
    res.status(200).json(transactions);
  } catch (error) {
    console.error('error:', error.message)
    res.status(500).json({
      message: error.message,
    });
  }
};