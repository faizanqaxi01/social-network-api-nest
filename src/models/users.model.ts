import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
      required: [true, 'Password missing'],
      min: 3,
      max: 50,
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

// Functions to fire before document gets saved to DB
// Hashing passwords before saving to DB
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Parameters: Email and Password
// Return: Returns user if the user is logged in successfully
UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};
