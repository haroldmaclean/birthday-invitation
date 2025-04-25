import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const invitationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [commentSchema], // ✅ Add this line
  },
  { timestamps: true }
);

const Invitation =
  mongoose.models.Invitation || mongoose.model('Invitation', invitationSchema);

export default Invitation;
