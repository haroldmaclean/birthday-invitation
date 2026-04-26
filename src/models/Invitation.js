import mongoose from 'mongoose';

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true },
);

// Invitation Schema
const invitationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    /* 🚀 UPDATED: Likes is now an Array of Strings (emails).
    This prevents users from liking multiple times.
    Old version: likes: { type: Number, default: 0 }
    */
    likes: {
      type: [String],
      default: [],
    },
    comments: [commentSchema],
  },
  { timestamps: true },
);

// Invitation Model
const Invitation =
  mongoose.models.Invitation || mongoose.model('Invitation', invitationSchema);

export default Invitation;

// import mongoose from 'mongoose';

// // Comment Schema
// const commentSchema = new mongoose.Schema(
//   {
//     text: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// // Invitation Schema
// const invitationSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     date: { type: Date, required: true }, // Changed to Date type for better date handling
//     location: { type: String, required: true },
//     likes: { type: Number, default: 0 },
//     comments: [commentSchema], // Array of comments
//   },
//   { timestamps: true }
// );

// // Invitation Model
// const Invitation =
//   mongoose.models.Invitation || mongoose.model('Invitation', invitationSchema);

// export default Invitation;
