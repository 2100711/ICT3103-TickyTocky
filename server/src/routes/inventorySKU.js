import express from "express";
import { createInventorySKU, getAllInventorySKUs, getInventorySKUById, updateInventorySKUById, deleteInventorySKUById } from "../controls/inventorySKU.js";

const inventorySKURouter = express.Router();
inventorySKURouter.post('/', createInventorySKU);
inventorySKURouter.get('/', getAllInventorySKUs);
inventorySKURouter.get('/:skuID', getInventorySKUById);
inventorySKURouter.put('/:skuID', updateInventorySKUById);
inventorySKURouter.delete('/:skuID', deleteInventorySKUById);

export { inventorySKURouter };
