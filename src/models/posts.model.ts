import mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 0,
      max: 50,
    },
    desc: {
      type: String,
      required: true,
      min: 0,
      max: 1000,
    },
  },
  { timestamps: true },
);
