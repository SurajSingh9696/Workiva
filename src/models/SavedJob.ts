import mongoose, { Schema, Document, Model } from 'mongoose';
import { IJob } from './Job';
import { IApplicant } from './Applicant';

export interface ISavedJob extends Document {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId | IJob;
  applicantId: mongoose.Types.ObjectId | IApplicant;
  createdAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>(
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const SavedJob: Model<ISavedJob> = mongoose.models.SavedJob || mongoose.model<ISavedJob>('SavedJob', savedJobSchema);

export default SavedJob;
