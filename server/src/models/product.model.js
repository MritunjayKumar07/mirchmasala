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
      type: String,
      // Use Cloudinary
    },
    size: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
      required: true,
      lowercase: true,
      index: true,
    },
    tag: [String],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    review: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        review: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    products: [itemSchema],
  },
  { timestamps: true }
);

// Adding index to ensure unique combination of category and product name
itemSchema.index({ category: 1, name: 1 }, { unique: true });

export const Product = mongoose.model("Product", productSchema);
