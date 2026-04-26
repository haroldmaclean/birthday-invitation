import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  author: {
    type: String,
    default: 'Anonymous',
  },
  authorEmail: {
    type: String,
    required: false,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  /* 🚀 NEW: YouTube-Style Likes 
  We use an array of strings (emails) to ensure each user can only like once.
  Old version was likely: likes: { type: Number, default: 0 }
  */
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensures we don't redefine the model if it already exists
export default mongoose.models.Comment ||
  mongoose.model('Comment', commentSchema);

// import mongoose from 'mongoose';

// const commentSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 300,
//   },
//   author: {
//     type: String,
//     default: 'Anonymous',
//   },
//   // 🔒 Fixed: Required is false so guests can post freely
//   authorEmail: {
//     type: String,
//     required: false,
//     default: '',
//   },
//   avatar: {
//     type: String,
//     default: '',
//   },
//   image: {
//     type: String,
//     default: '',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Ensures we don't redefine the model if it already exists
// export default mongoose.models.Comment ||
//   mongoose.model('Comment', commentSchema);
