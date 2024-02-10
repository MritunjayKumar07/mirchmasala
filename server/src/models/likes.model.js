import mongoose, { Schema } from "mongoose";

const likeShema = new Schema(
  {
    likeBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likeOn: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeShema);
