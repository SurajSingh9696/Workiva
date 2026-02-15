import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  userName: string;
  password: string;
  email: string;
  role: 'admin' | 'applicant' | 'employer';
  phoneNumber?: string;
  avatarUrl?: string;
  theme?: 'light' | 'dark';
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['admin', 'applicant', 'employer'],
      default: 'applicant',
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
