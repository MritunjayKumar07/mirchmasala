import mongoose from "mongoose";

const { Schema } = mongoose;

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: {  // Corrected the spelling here
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    items: [orderItemSchema],  // Simplified array notation
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "DELIVERED"],
      required: true,
      index: true,
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);  // Export corrected model
