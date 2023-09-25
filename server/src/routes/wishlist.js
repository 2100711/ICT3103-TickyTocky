import express from "express";
import { createWishlist, getAllWishlist } from "../controls/wishlist.js";

const wishlistRouter = express.Router();
wishlistRouter.post("/", createWishlist);
wishlistRouter.get("/", getAllWishlist);
// wishlistRouter.get("/:wishlistID", getWishlistById);
// wishlistRouter.put("/:wishlistID", updateWishlistById);
// wishlistRouter.delete("/:wishlistID", deleteWishlistById);

export { wishlistRouter };
