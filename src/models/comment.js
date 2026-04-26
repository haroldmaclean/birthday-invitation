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
  // 🔒 Fixed: Required is false so guests can post freely
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

//   // 🔒 SECURITY: Stores the Google Email to restrict Edit/Delete access
//   authorEmail: {
//     type: String,
//     required: true, // Required so we always know who owns the comment
//   },

//   // ✅ NEW: user avatar (profile image from Google)
//   avatar: {
//     type: String,
//     default: '',
//   },

//   // ✅ NEW: optional image inside comment
//   image: {
//     type: String,
//     default: '',
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const comment =
//   mongoose.models.Comment || mongoose.model('Comment', commentSchema);
// export default comment;

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

//   // ✅ NEW: user avatar (profile image)
//   avatar: {
//     type: String,
//     default: '',
//   },

//   // ✅ NEW: optional image inside comment
//   image: {
//     type: String,
//     default: '',
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const comment =
//   mongoose.models.Comment || mongoose.model('Comment', commentSchema);
// export default comment;
