import SavingGoal from '../models/SavingGoal.js';


//create goal
export const createGoal = async (req, res) => {
  try{
    const{ name, targetAmount, deadline} = req.body

    const goal = await SavingGoal.create({
      user: req.userid,
      name,
      targetAmount,
      deadline,
    })
    res.status(201).json({message: 'Goal created successfully', goal })
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

//get all goals
export const getGoals = async (req, res) => {
  try{
    const goals = await SavingGoal.find({ user: req.user.id}).sort({createdAt: -1})

    res.status(200).json({count: goals.length, goals})
  }catch(error){
    res.status(500).json({message: error.message})
  }
} 


//get a specific goal
export const getGoal = async (req, res ) => {
  try{
    const goal = await SavingGoal.findOne({
      _id:  req.params.id,
      user: req.user.id,
    })

    if (!goal){
      return res.status(404).json({message: 'Goal not found'})
    }


    res.status(200).json(goal)
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

//add money to goal
export const addToGoal = async (res,req) => {
  try{
    const {amount} = req.body

    if(!amount || amount <= 0){
      return res.status(400).json({message: 'Amount must be greater than 0'})
    }

    const goal = await SavingGoal.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!goal){
      return res.status(404).json({message: 'Goal not found'})
    }

    if(goal.isCompleted){
      return res.status(400).json({message: 'Goal is already completed'})
    }

    goal.savedAmount += amount

    if(goal.savedAmount >= goal.targetAmount){
      goal.savedAmount = goal.targetAmount //cap it at target
      goal.isCompleted = true
    }

    await goal.save()

    res.status(200).json({message: 'Amount added to goal', goal})
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

//update goal
export const updateGoal = async (res, req) => {
  try{
    const goal = await SavingGoal.findOneAndUpdate(
      {_id: req.params.id, user: req.user.id},
      req.body,
      {new: true , runValidators: true}
    )

    if(!goal){
      return res.status(404).json({message: 'Goal not found'})
    }


    res.status(200).json({message: 'Goal updated successfully', goal})
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

//delete goal
export const deleteGoal = async (req, res) => {
  try{
    const goal = await SavingGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    })

    if(!goal){
      return res.status(404).json({message: 'Goal not found'})
    }

    res.status(200).json({message: 'Goal deleted'})
  }catch(error){
    res.status(500).json({message: error.message})
  
  }
}