import express from 'express'
import { createUser, getAllUsers, getOneUser, loginUser, updateUser } from '../controller/userController.js'
import { authentication } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/adminMiddleware.js'
const route = express.Router()

route.post('/user', createUser)
route.post('/loginUser', loginUser)
route.put('/updateUser/:userId', authentication, updateUser)
route.get('/getUsers', authentication, isAdmin, getAllUsers)
route.get('/getOneUser/:id', authentication, isAdmin, getOneUser)

export default route
