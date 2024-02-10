import mongoose, { Schema } from "mongoose";

const complaintShema = new Schema(
  {
    complaint: {
      type: String,
      required: true,
      lowercase: true,
    },
    complaintBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintShema);
