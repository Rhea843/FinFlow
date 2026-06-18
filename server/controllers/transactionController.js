import Transaction from '../models/transaction.js'

//create transaction
export const createTransaction = async (req, res) => {
  try{
    const {type, amount, category, description, date } = req.body

    const transaction = await Transaction.create({
      user: req.user.id,
      type, 
      amount,
      category,
      description,
      date
    })

    res.status(201).json({message: 'Transaction created successfully', transaction})
  }catch (error){
    res.status(500).json({ message: error.message})
  }
}

//get all transactions
export const getTransactions = async (req, res) => {
  try{
    const {type, category, startDate, endDate} = req.query

    //build filter object
    const filter = {user: req.user.id}
    
    if(type) filter.type = type
    if(category) filter.category = {$regex: category, $options: 'i'}
    if(startDate || endDate) {
      filter.date = {}
      if(startDate) filter.date.$gte = new Date(startDate)
      if(endDate) filter.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(filter).sort({date: -1})
    
    //calculate totals
    const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

    const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

    res.status(200).json({
      count: transactions.length,
      income,
      expenses,
      balance: income - expenses,
      transactions,
    })

  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

//get a single transaction
export const getTransaction = async (req, res) => {
  try{
    const transaction = await Transaction.findOne({
      __id: req.params.id,
      user: req.user.id,
    })

    if(!transaction) {
      return res.status(404).json({message: 'Transaction not found'})
    }

    res.status(200).json({transaction})
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

//Update Transaction
export const updateTransaction = async (req, res) => {
  try{
    const transaction = await Transaction.findOneAndUpdate(
      { __id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    )
    if(!transaction) {
      return res.status(404).json({message: 'Transaction not found'})
    }
    res.status(200).json({ message:'Transaction updated', transaction})
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

//Delete transaction
export const deleteTransaction = async (req, res) => {
  try{
    const transaction = await Transaction.findOneAndDelete({
      __id: req.params.id,
      user: req.user.id,
    })

    if(!transaction) {
      return res.status(404).json({message: 'Transaction not found'})
    }
    res.status(200).json({message: 'Transaction deleted'})
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
  
}