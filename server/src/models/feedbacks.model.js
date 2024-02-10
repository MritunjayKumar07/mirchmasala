import mongoose, { Schema } from "mongoose";

const feedbackShema = new Schema(
  {
    feedback: {
      type: String,
      required: true,
      lowercase: true,
    },
    feedbackBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackShema);
