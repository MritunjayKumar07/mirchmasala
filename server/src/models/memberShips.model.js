import mongoose, { Schema } from "mongoose";

const memberShipShema = new Schema(
  {
    memberShipBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    memberShipType: {
      type: Schema.Types.ObjectId,
      ref: "MemberShipClass",
    },
  },
  { timestamps: true }
);

export const MemberShip = mongoose.model("MemberShip", memberShipShema);
