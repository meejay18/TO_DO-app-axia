import express from 'express'
import {
  createTask,
  deleteTask,
  getAllTasks,
  getOneTask,
  updateTask,
  updateTaskStatus,
} from '../controller/taskController.js'
import { authentication } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/adminMiddleware.js'
import { userAndAdmin } from '../middleware/checkUserOrAdminMiddleware.js'

const route = express.Router()

route.post('/task', authentication, createTask)
route.get('/getOneTask/:taskId', authentication, getOneTask)
route.get('/getAllTask', authentication, isAdmin, getAllTasks)
route.put('/updateTask/:taskId', authentication, userAndAdmin, updateTask)
route.delete('/deleteTask/:taskId', authentication, userAndAdmin, deleteTask)
route.put('/updateStatus/:taskId', authentication, updateTaskStatus)

export default route
