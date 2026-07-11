import './config/env.js'  
import express from'express';
import cors from 'cors'
import connectDB from './config/database.js';
import authRoutes from './routes/authRoute.js';
import userRouter from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoute.js'; 
import savingGoalRoutes from './routes/savingGoalRoutes.js';
import savingTransactionRoutes from './routes/savingTransactionRoutes.js'


connectDB()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users', userRouter)
app.use('/api/transactions', transactionRoutes)
app.use('/api/goals', savingGoalRoutes)
app.use("/api/saving-transactions", savingTransactionRoutes);


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port ${PORT}`));