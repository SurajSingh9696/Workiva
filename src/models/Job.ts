import mongoose, { Schema, Document, Model } from 'mongoose';
import { IEmployer } from './Employer';
import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from '@/config/constant';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  employerId: mongoose.Types.ObjectId | IEmployer;
  description: string;
  tags?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency?: typeof SALARY_CURRENCY[number];
  salaryPeriod?: typeof SALARY_PERIOD[number];
  location?: string;
  jobType?: typeof JOB_TYPE[number];
  workType?: typeof WORK_TYPE[number];
  jobLevel?: typeof JOB_LEVEL[number];
  experience?: string;
  minEducation?: typeof MIN_EDUCATION[number];
  isFeatured: boolean;
  expiresAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
    },
    minSalary: {
      type: Number,
    },
    maxSalary: {
      type: Number,
    },
    salaryCurrency: {
      type: String,
      enum: SALARY_CURRENCY,
    },
    salaryPeriod: {
      type: String,
      enum: SALARY_PERIOD,
    },
    location: {
      type: String,
    },
    jobType: {
      type: String,
      enum: JOB_TYPE,
    },
    workType: {
      type: String,
      enum: WORK_TYPE,
    },
    jobLevel: {
      type: String,
      enum: JOB_LEVEL,
    },
    experience: {
      type: String,
    },
    minEducation: {
      type: String,
      enum: MIN_EDUCATION,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);

export default Job;
