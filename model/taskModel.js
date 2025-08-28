import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: String,
      enum: ['work', 'personal', 'laundry', 'others'],
      required: true,
      default: 'others',
    },
    status: {
      type: String,
      required: true,
      enum: ['not started', 'active', 'completed'],
      default: 'not started',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
)

const taskModel = mongoose.model('task', taskSchema)

export default taskModel
