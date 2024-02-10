import mongoose, { Schema } from "mongoose";

const memberShipClassShema = new Schema(
  {
    type: {
      type: String,
      enum: ["Basic", "Premium", "Gold"],
      required: true,
    },
    benefits: [String],
    durationMonths: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const MemberShipClass = mongoose.model(
  "MemberShipClass",
  memberShipClassShema
);
