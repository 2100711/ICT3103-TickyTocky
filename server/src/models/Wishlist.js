import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    wishlistID: {
        type: String,
        required: true,
        unique: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    skuID: {
        type: mongoose.Schema.Types.ObjectId,
        required: "inventoryskus",
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

export const WishlistModel = mongoose.model("wishlist", wishlistSchema);