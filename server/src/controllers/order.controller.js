import { Order } from "../models/orders.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Place Order
const placeOrder = asyncHandler(async (req, res) => {
  try {
    const { user, deliveryAddress, items, contactNumber } = req.body;
    console.log(user);
    console.log(deliveryAddress);
    console.log(items);
    console.log(contactNumber);
    //Validate deliveryAddress and items
    if (!deliveryAddress || !items) throw new ApiError(404, "Missing fields");

    const newOrder = await Order.create({
      user,
      deliveryAddress,
      items,
      contactNumber,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newOrder, "Order place successfully."));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userOrders = await Order.find({ user: userId });
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { placeOrder, getUserOrders };
