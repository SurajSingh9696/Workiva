import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IApplicant extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | IUser;
  biography?: string;
  dateOfBirth?: Date;
  nationality?: string;
  maritalStatus?: 'single' | 'married' | 'divorced';
  gender?: 'male' | 'female' | 'other';
  education?: 'none' | 'high school' | 'undergraduate' | 'masters' | 'phd';
  experience?: string;
  websiteUrl?: string;
  location?: string;
  resumeUrl?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicantSchema = new Schema<IApplicant>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    biography: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    nationality: {
      type: String,
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    education: {
      type: String,
      enum: ['none', 'high school', 'undergraduate', 'masters', 'phd'],
    },
    experience: {
      type: String,
    },
    websiteUrl: {
      type: String,
    },
    location: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Applicant: Model<IApplicant> = mongoose.models.Applicant || mongoose.model<IApplicant>('Applicant', applicantSchema);

export default Applicant;
