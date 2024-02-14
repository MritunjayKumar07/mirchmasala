import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Get all products
const getProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(new ApiResponse(200, products));
});

// Get category all product by ID
const getCategoryById = asyncHandler(async (req, res) => {
  const categoryId = req.query.categoryId;
  if (!categoryId) {
    throw new ApiError(400, "Category ID is required.");
  }

  const product = await Product.findById(categoryId);
  if (!product) {
    throw new ApiError(404, "Category not found.");
  }

  return res.status(200).json(new ApiResponse(200, product));
});

// Get particuler product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { categoryId, productId } = req.query;
  if (!productId) {
    throw new ApiError(400, "Product ID is required.");
  }

  const category = await Product.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }
  const product = category.products.filter((p) => p._id == productId);

  return res.status(200).json(new ApiResponse(200, product));
});

//Add Category addCatogry
const addCatogry = asyncHandler(async (req, res, next) => {
  try {
    const { category } = req.body;

    // Validate input data
    if (!category) {
      throw new ApiError(400, "Category name is required.");
    }

    // Check if the category already exists
    const existingCategory = await Product.findOne({
      category: category.toLowerCase(),
    });

    if (existingCategory) {
      throw new ApiError(409, "Category already exists.");
    }

    // Create the new category
    const newCategory = await Product.create({
      category: category.toLowerCase(),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newCategory, "Category added successfully."));
  } catch (error) {
    next(error);
  }
});

//Add Products
const addProduct = asyncHandler(async (req, res, next) => {
  const {
    category,
    name,
    description,
    originalPrice,
    discountedPrice,
    size,
    status,
  } = req.body;

  if (!category || !name || !description || !originalPrice) {
    throw new ApiError(
      400,
      "Category, name, description, and original price are required."
    );
  }

  let image = req.file ? req.file.path : null;
  image = await uploadOnCloudinary(req.file.path);

  try {
    let existingCategory = await Product.findOne({ category });

    if (!existingCategory) {
      const newProduct = new Product({
        category,
        products: [
          {
            name,
            description,
            originalPrice,
            discountedPrice: discountedPrice ?? null,
            size: size ?? null,
            status: status ?? "offline",
            image: image?.secure_url,
          },
        ],
      });

      await newProduct.save();
      res
        .status(200)
        .json(new ApiResponse(200, newProduct, "Product added successfully."));
    } else {
      // Use $addToSet operator to avoid race conditions
      const updatedCategory = await Product.findOneAndUpdate(
        { category, "products.name": { $ne: name } }, // Ensure no existing product with the same name
        {
          $addToSet: {
            products: {
              name,
              description,
              originalPrice,
              discountedPrice: discountedPrice ?? null,
              size: size ?? null,
              status: status ?? "offline",
              image: image?.secure_url,
            },
          },
        },
        { new: true }
      );

      if (!updatedCategory) {
        throw new ApiError(
          400,
          "Product with this name already exists in this category."
        );
      }

      res
        .status(200)
        .json(
          new ApiResponse(200, updatedCategory, "Product added successfully.")
        );
    }
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      next(new ApiError(400, "Duplicate key error. Please ensure uniqueness."));
    } else {
      next(error); // For other errors, propagate to the error handler
    }
  }
});

//----------------------Top Complite --------------------------

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.query.productId;
  if (!productId) {
    throw new ApiError(400, "Product ID is required.");
  }

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Product deleted successfully."));
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.query.productId;

  res
    .status(200)
    .json(new ApiResponse(200, user, "Address added successfully."));
});

// Update product image
const imageUpdateProduct = asyncHandler(async (req, res) => {
  const productId = req.query.productId;
  res.status(201).json({ message: "ok." });
});

export {
  getProduct,
  getCategoryById,
  getProductById,
  addCatogry,
  addProduct,
  deleteProduct,
  updateProduct,
  imageUpdateProduct,
};
