import taskModel from '../model/taskModel.js'
import userModel from '../model/userModel.js'

export const createTask = async (req, res, next) => {
  const { id } = req.user
  const { startTime, dueDate, ...others } = req.body
  try {
    const newTask = new taskModel({
      creator: id,
      startTime: new Date(startTime),
      dueDate: new Date(dueDate),
      ...others,
    })
    const savedTask = await newTask.save()

    await userModel.findByIdAndUpdate(id, { $push: { task: savedTask } }, { new: true })

    return res.status(201).json({
      message: 'Task created successfully',
      data: savedTask,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskModel.find()

    return res.status(201).json({
      message: 'Tasks retrieved successfully',
      data: tasks,
    })
  } catch (error) {
    next(error)
  }
}
export const getOneTask = async (req, res, next) => {
  const { id, role } = req.user
  const { taskId } = req.params
  try {
    const task = await taskModel.findById(taskId).populate('creator', 'name email')

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }
    const isOwner = task.creator._id === id
    const isAdmin = role === 'admin'

    if (isOwner || isAdmin) {
      return res.status(200).json({
        message: 'task retrieved',
        data: task,
      })
    } else {
      return res.status(403).json({
        message: 'forbidden, you cannot see this task',
      })
    }
  } catch (error) {
    next(error)
  }
}

export const updateTask = async (req, res, next) => {
  const { id } = req.user
  const { taskId } = req.params

  try {
    const task = await taskModel.findById(taskId)

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }
    if (task.creator.toString() !== id || req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'forbidden, you cannot perform this action',
      })
    }

    const data = req.body
    const updatedData = await taskModel.findByIdAndUpdate(taskId, { ...data }, { new: true })

    return res.status(200).json({
      message: 'Tasks updated successfully',
      data: updatedData,
    })
  } catch (error) {
    next(error)
  }
}
export const deleteTask = async (req, res, next) => {
  const { id } = req.user
  const { taskId } = req.params

  try {
    const task = await taskModel.findById(taskId)
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    if (task.creator.toString() !== id || req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'forbidden, You cannot delete this task',
      })
    }
    const deletedTask = await taskModel.findByIdAndDelete(taskId)

    return res.status(201).json({
      message: 'Tasks deleted successfully',
      data: deletedTask,
    })
  } catch (error) {
    next(error)
  }
}
export const updateTaskStatus = async (req, res, next) => {
  const { taskId } = req.params
  const { id, role } = req.user
  const { status, completed } = req.body
  try {
    const task = await taskModel.findById(taskId)

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    if (task.creator.toString() !== id || role !== 'admin') {
      return res.status(403).json({
        message: 'You cannot perform this operation',
      })
    }

    const updatedStatus = await taskModel.findByIdAndUpdate(taskId, { status, completed }, { new: true })
    return res.status(200).json({
      message: 'Task status updated successfully',
      data: updatedStatus,
    })
  } catch (error) {
    next(error)
  }
}

export const filterCategory = async (req, res, next) => {
  const { category } = req.params
  const { id } = req.user
  try {
    const task = await taskModel.find({ creator: id, category })

    if (task.length === 0) {
      return res.status(404).json({
        message: 'No task with this category',
      })
    }

    return res.status(200).json({
      message: 'Task filtered by category',
      data: task,
    })
  } catch (error) {
    next(error)
  }
}
export const filterDuedate = async (req, res, next) => {
  const { dueDate } = req.params
  const { id } = req.user

  try {
    const task = await taskModel.find({ creator: id, dueDate: { $lte: new Date(dueDate) } })

    if (task.length === 0) {
      return res.status(404).json({
        message: `No task on or before ${dueDate}`,
      })
    }

    return res.status(200).json({
      message: `Tasks due on or before ${dueDate}`,
      data: task,
    })
  } catch (error) {
    next(error)
  }
}
