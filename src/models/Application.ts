import mongoose, { Schema, Document, Model } from 'mongoose';
import { IJob } from './Job';
import { IApplicant } from './Applicant';

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId | IJob;
  applicantId: mongoose.Types.ObjectId | IApplicant;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'Applicant',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'accepted', 'rejected'],
      default: 'pending',
      required: true,
    },
    coverLetter: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
