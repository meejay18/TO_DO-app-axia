import express from 'express'
import mongoose from 'mongoose'
import env from 'dotenv'
const app = express()
const PORT = 5500
import userRoute from './route/userRoute.js'
import taskRoute from './route/taskRoute.js'
import cookieparser from 'cookie-parser'

app.use(express.json())
app.use(cookieparser())

app.use(userRoute)
app.use(taskRoute)

env.config()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    // console.log(err)
    console.log(err.message)
  })

app.use((error, req, res, next) => {
  return res.status(error.status || 500).json(error.message || 'An error occured')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
