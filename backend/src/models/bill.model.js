import mongoose, { Schema } from "mongoose";

const billSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    item: {
      type: String,
      required: true,
      trim: true,
    },
    itemDescription: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lastCharge: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Bill = mongoose.model("Bill", billSchema);
