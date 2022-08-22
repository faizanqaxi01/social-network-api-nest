import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email missing'],
      min: 3,
      max: 30,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isModerator: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'unpaid',
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);
