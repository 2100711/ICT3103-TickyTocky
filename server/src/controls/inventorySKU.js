// Create a new InventorySKU
const createInventorySKU = async (req, res) => {
  console.log("Creating InventorySKU...", req.body);
  try {
    const inventorySKU = new InventorySKU(req.body);
    await inventorySKU.save();
    res.status(201).json(inventorySKU);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create InventorySKU' });
  }
};

// Read all InventorySKUs
const getAllInventorySKUs = async (req, res) => {
  try {
    const inventorySKUs = await InventorySKU.find();
    res.json(inventorySKUs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch InventorySKUs' });
  }
};

// Read a specific InventorySKU by ID
const getInventorySKUById = async (req, res) => {
  try {
    const inventorySKU = await InventorySKU.findById(req.params.skuId);
    if (!inventorySKU) {
      return res.status(404).json({ error: 'InventorySKU not found' });
    }
    res.json(inventorySKU);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch InventorySKU' });
  }
};

// Update a specific InventorySKU by ID
const updateInventorySKUById = async (req, res) => {
  try {
    const inventorySKU = await InventorySKU.findByIdAndUpdate(req.params.skuId, req.body, {
      new: true, // Return the updated document
    });
    if (!inventorySKU) {
      return res.status(404).json({ error: 'InventorySKU not found' });
    }
    res.json(inventorySKU);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update InventorySKU' });
  }
};

// Delete a specific InventorySKU by ID
const deleteInventorySKUById = async (req, res) => {
  try {
    const inventorySKU = await InventorySKU.findByIdAndRemove(req.params.skuId);
    if (!inventorySKU) {
      return res.status(404).json({ error: 'InventorySKU not found' });
    }
    res.json({ message: 'InventorySKU deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete InventorySKU' });
  }
};

export { createInventorySKU, getAllInventorySKUs, getInventorySKUById, updateInventorySKUById, deleteInventorySKUById }