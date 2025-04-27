import mongoose from 'mongoose';

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Define and export the Comment Model
const Comment =
  mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
