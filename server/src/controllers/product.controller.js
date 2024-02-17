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
  if (product) {
    throw new ApiError(404, "Product not found.");
  }

  return res.status(200).json(new ApiResponse(200, product));
});

//Add Category addCatogry
const addCatogry = asyncHandler(async (req, res, next) => {
  try {
    const { category } = req.body;
    let image = req.file ? req.file.path : null;
    if (image) {
      image = await uploadOnCloudinary(req.file.path);
    }

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
      image: image ? image.secure_url : null,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newCategory, "Category added successfully."));
  } catch (error) {
    next(error);
  }
});

//Add Category addCatogry
const addCatogryImage = asyncHandler(async (req, res, next) => {
  try {
    const { category } = req.body;
    let image = req.file ? req.file.path : null;
    if (!image) {
      image = await uploadOnCloudinary(req.file.path);
    }

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
      image: image ? image.secure_url : null,
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

// Delete a product
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { categoryId, productId } = req.query;

  try {
    // Validate productId and categoryId
    if (!productId || !categoryId) {
      throw new ApiError(400, "Both categoryId and productId are required.");
    }

    const category = await Product.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }

    //If not any product return -1 which is false value
    const productIndex = category.products.findIndex((p) => p._id == productId);

    if (productIndex) {
      throw new ApiError(404, "Product not found.");
    }

    // Remove the product from the products array
    category.products.splice(productIndex, 1);

    // Save the updated category
    await category.save();

    res.status(200).json(new ApiResponse(200, "Product deleted successfully."));
  } catch (error) {
    next(error);
  }
});

// Update product image
const imageUpdateProduct = asyncHandler(async (req, res, next) => {
  const { categoryId, productId } = req.query;
  let image = req.file.path;

  try {
    // Validate productId and categoryId
    if (!productId || !categoryId) {
      throw new ApiError(400, "Both categoryId and productId are required.");
    }

    // Validate image
    if (!image) {
      throw new ApiError(400, "Image is required.");
    }

    // Upload image to cloudinary
    const uploadedImage = await uploadOnCloudinary(image);

    // Find the category by categoryId
    const category = await Product.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }

    // Find the index of the product with productId in the products array of the category
    const productIndex = category.products.findIndex((p) => p._id == productId);
    if (productIndex) {
      throw new ApiError(404, "Product not found.");
    }

    // Update the image of the product
    category.products[productIndex].image = uploadedImage.secure_url;

    // Save the updated category
    const newProduct = await category.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, newProduct, "Product image updated successfully.")
      );
  } catch (error) {
    next(error);
  }
});

//----------------------Top Complite --------------------------

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.query.productId;

  res
    .status(200)
    .json(new ApiResponse(200, user, "Address added successfully."));
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
