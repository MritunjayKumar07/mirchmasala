import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
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
    contactNumber:{
      type: String,
      required: true
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "DELIVERED"],
      index: true,
      default: "PENDING",
      validate: { // Custom validator for enum values
        validator: function (value) {
          return ["PENDING", "CANCELLED", "DELIVERED"].includes(value);
        },
        message: props => `${props.value} is not a valid status`,
      },
    },
  },
  { timestamps: true }
);

// Make the index sparse for status field
orderSchema.index({ status: 1 }, { sparse: true });

export const Order = mongoose.model("Order", orderSchema);
