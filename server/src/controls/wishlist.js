import { WishlistModel } from "../models/Wishlist.js";
import { InventorySKUModel } from "../models/InventorySKU.js";
import { UserModel } from "../models/Users.js";

const createWishlist = async (req, res) => {
  console.log("session: ", req.sessionID);
  console.log("Creating Wishlist...", req.body);
  try {
    const skuObjectID = await InventorySKUModel.findOne(
      { skuID: req.body.skuID },
      "_id"
    );

    const userObjectID = await UserModel.findOne(
      { email: req.body.email },
      "_id"
    );

    const wishlist = new WishlistModel({
      wishlistID: req.body.wishlistID,
      skuID: skuObjectID._id,
      userID: userObjectID._id,
    });
    await wishlist.save();
    return res.status(201).json(wishlist);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Failed to create Wishlist" });
  }
};

// Read all Wishlists
const getAllWishlist = async (req, res) => {
  console.log(req.session);
  try {
    const wishlists = await WishlistModel.find({}, { _id: false }).populate([
      {
        path: "skuID",
        model: "inventoryskus",
        select: "-_id",
      },
      {
        path: "userID",
        model: "users",
        select: "-_id email",
      },
    ]);
    return res.status(201).json(wishlists);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch Wishlists" });
  }
};

// Read a specific Wishlist by ID
const getWishlistById = async (req, res) => {
  try {
    const wishlist = await WishlistModel.findOne({
      wishlistID: req.params.wishlistID,
    });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    return res.status(201).json(wishlist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch Wishlist" });
  }
};

const getWishlistByEmail = async (req, res) => {
  try {
    const userObjectID = await UserModel.findOne(
      { email: req.body.email },
      "_id"
    );

    const wishlists = await WishlistModel.find(
      { userID: userObjectID },
      { _id: false }
    ).populate([
      {
        path: "skuID",
        model: "inventoryskus",
        select: "-_id",
      },
      {
        path: "userID",
        model: "users",
        select: "-_id email",
      },
    ]);
    if (!wishlists) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    return res.status(201).json(wishlists);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch Wishlist" });
  }
};

// Update a specific Wishlist by ID
// To check if needed
const updateWishlistById = async (req, res) => {
  try {
    const wishlist = await WishlistModel.findOneAndUpdate(
      { wishlistID: req.params.wishlistID },
      req.body,
      {
        new: true, // Return the updated document
      }
    );
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Failed to update InventorySKU" });
  }
};

// Delete a specific wishlist by ID
const deleteWishlistById = async (req, res) => {
  try {
    const wishlist = await WishlistModel.deleteOne({
      wishlistID: req.params.wishlistID,
    });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    return res.status(201).json({ message: "Wishlist deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete Wishlist" });
  }
};

export {
  createWishlist,
  getAllWishlist,
  getWishlistById,
  getWishlistByEmail,
  updateWishlistById,
  deleteWishlistById,
};
