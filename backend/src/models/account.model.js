import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    accountName: {
      type: String,
      // required: true,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ['checking', 'savings', 'credit'],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    budgets: [
      {
        category: {
          type: String,
          trim: true,
        },
        amount: {
          type: Number,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Account = mongoose.model("Account", accountSchema);
