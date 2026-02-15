import mongoose, { Schema, Model } from 'mongoose';

export interface ISession {
  _id: string;
  userId: mongoose.Types.ObjectId;
  userAgent: string;
  ip: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    _id: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);

export default Session;
