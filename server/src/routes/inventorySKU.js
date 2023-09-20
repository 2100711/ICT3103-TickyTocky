import express from "express";
import { createInventorySKU, getAllInventorySKUs, getInventorySKUById, updateInventorySKUById, deleteInventorySKUById } from "../controls/inventorySKU.js";

const inventorySKUinventorySKURouter = express.inventorySKURouter();
inventorySKURouter.post('/inventory', createInventorySKU);
inventorySKURouter.get('/inventory', getAllInventorySKUs);
inventorySKURouter.get('/inventory/:id', getInventorySKUById);
inventorySKURouter.put('/inventory/:id', updateInventorySKUById);
inventorySKURouter.delete('/inventory/:id', deleteInventorySKUById);

export { inventorySKURouter };
