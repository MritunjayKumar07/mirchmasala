import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
    },
    originalPrice: {
      type: Number,
      default: 0.0,
      required: true,
    },
    discountedPrice: {
      type: Number,
      index: true,
    },
    image: {
      // Use Cloudinary
      type: String,
    },
    size: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
      index: true,
    },
    tag: [String],
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    products: {
      type: [itemSchema],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
