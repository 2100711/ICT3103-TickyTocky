import { WishlistModel } from "../models/Wishlist.js";
import { InventorySKUModel } from "../models/InventorySKU.js";
import { UserModel } from "../models/Users.js";

const createWishlist = async (req, res) => {
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
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create Wishlist" });
  }
};

// Read all Wishlists
const getAllWishlist = async (req, res) => {
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
    res.status(201).json(wishlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Wishlists" });
  }
};

export { createWishlist, getAllWishlist };
