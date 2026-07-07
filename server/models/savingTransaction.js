import mongoose from "mongoose";

const savingTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavingGoal",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["deposit", "withdrawal"],
      default: "deposit",
    },


    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SavingTransaction",
  savingTransactionSchema
);