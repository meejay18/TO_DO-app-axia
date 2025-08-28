import taskModel from '../model/taskModel.js'

export const userAndAdmin = async (req, res, next) => {
  const { id, role } = req.user
  const { taskId } = req.params
  try {
    const task = await taskModel.findById(taskId)
    if (!task) {
      return res.status(404).json({
        message: 'task not found',
      })
    }
    if (task.creator.toString() !== id || role !== 'admin') {
      return res.status(403).json({
        message: 'forbidden, you cannot perform this action',
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}
