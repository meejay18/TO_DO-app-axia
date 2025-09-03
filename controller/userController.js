import userModel from '../model/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const createUser = async (req, res, next) => {
  const { name, password, email, ...others } = req.body

  try {
    const checkMail = await userModel.findOne({ email })
    if (checkMail) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const newUser = new userModel({ name, password: hashed, email, ...others })
    const savedUser = await newUser.save()

    return res.status(201).json({
      message: 'User created successfullly',
      data: savedUser,
    })
  } catch (error) {
    next(error)
  }
}
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(404).json({
      message: 'email is required',
    })
  }
  if (!password) {
    return res.status(404).json({
      message: 'password is required',
    })
  }

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: 'User not found, login to your account',
      })
    }

    const checkPassword = bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res.status(400).json({
        message: 'Incorrect password',
      })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2d',
    })

    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: true,
    })

    return res.status(200).json({
      message: 'login successfull',
    })
  } catch (error) {
    next(error)
  }
}
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find()

    return res.status(200).json({
      message: 'Users retrieved successfullly',
      data: users,
    })
  } catch (error) {
    next(error)
  }
}
export const getOneUser = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await userModel.findById(id).populate('task')

    return res.status(200).json({
      message: 'User retrieved successfullly',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}
export const updateUser = async (req, res, next) => {
  const { id, role } = req.user
  const { userId } = req.params
  const data = req.body
  try {
    const user = await userModel.findById(id)
    console.log(user)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }
    const isOwner = user.id === id
    const isAdmin = role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You cannot carry out this operation',
      })
    }
    const updatedUser = await userModel.findByIdAndUpdate(userId, { ...data }, { new: true })

    return res.status(200).json({
      message: 'User updated successfullly',
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}
export const deleteUser = async (req, res, next) => {
  const { id } = req.user
  const { userId } = req.params

  try {
    const user = await userModel.findById(id)
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }
    const deletedUser = await userModel.findByIdAndDelete(userId)

    return res.status(200).json({
      message: 'user deleted',
      data: deletedUser,
    })
  } catch (error) {
    next(error)
  }
}
