import mongoose, { Schema } from "mongoose";

const reviewShema = new Schema(
  {
    review: {
      type: String,
      required: true,
      lowercase: true,
    },
    reviewBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewOn: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewShema);
