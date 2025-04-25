const invitationSchema = new mongoose.Schema(
  {
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
