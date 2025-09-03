import express from 'express'
import {
  createTask,
  deleteTask,
  filterCategory,
  filterDuedate,
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
route.get('/taskCat/:category', authentication, filterCategory)
route.get('/taskDate/:dueDate', authentication, filterDuedate)
// route.get('/getByCatAndDate', authentication, filterTaskByCategoryandDate)

export default route
