import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface IEmployer extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | IUser;
  name?: string;
  description?: string;
  bannerImageUrl?: string;
  organizationType?: string;
  teamSize?: string;
  yearOfEstablishment?: number;
  websiteUrl?: string;
  location?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employerSchema = new Schema<IEmployer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    bannerImageUrl: {
      type: String,
    },
    organizationType: {
      type: String,
    },
    teamSize: {
      type: String,
    },
    yearOfEstablishment: {
      type: Number,
    },
    websiteUrl: {
      type: String,
    },
    location: {
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

const Employer: Model<IEmployer> = mongoose.models.Employer || mongoose.model<IEmployer>('Employer', employerSchema);

export default Employer;
