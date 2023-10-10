import express from "express";
import {
  createWishlist,
  getAllWishlist,
  getWishlistById,
  getWishlistByEmail,
  updateWishlistById,
  deleteWishlistById,
} from "../controls/wishlist.js";
import { isAuthenticated } from "../controls/auth.js";

const wishlistRouter = express.Router();
wishlistRouter.post("/", createWishlist);
wishlistRouter.get("/", isAuthenticated, getAllWishlist);
wishlistRouter.get("/:wishlistID", getWishlistById);
wishlistRouter.post("/email", isAuthenticated, getWishlistByEmail);
wishlistRouter.put("/:wishlistID", updateWishlistById);
wishlistRouter.delete("/:wishlistID", deleteWishlistById);

export { wishlistRouter };
