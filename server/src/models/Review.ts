import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  text: string;
  userId: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  language: string;
  purchaseVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  replies: Array<{
    userId: Schema.Types.ObjectId;
    companyId: Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  helpful: number;
  reported: boolean;
  ipAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    purchaseVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    replies: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        companyId: {
          type: Schema.Types.ObjectId,
          ref: 'Company',
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    helpful: {
      type: Number,
      default: 0,
    },
    reported: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ReviewSchema.index({ companyId: 1, status: 1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ language: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
