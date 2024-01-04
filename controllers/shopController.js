const db = require("../database/dbController");

class ShopController {
    // Method to get all items
    async getItemAll(req, res) {
        try {
            return res.json(await db.getItemAll());
        } catch (error) {
            return res.status(500).json({ message: `${error}` });
        }
    }

    // Method to get a single item by ID
    async getItemOne(req, res) {
        try {
            const { itemId } = req.body;
            if (itemId == null) {
                return res.status(400).json({
                    message: "Error: Item id is not provided",
                });
            }
            return res.json(await db.getItemOne(itemId));
        } catch (error) {
            return res.status(500).json({ message: `${error}` });
        }
    }

    // Method to update item name by ID
    async updateItemName(req, res) {
        try {
            const { itemId, itemName } = req.body;
            if (itemId == null) {
                return res.status(400).json({
                    message: "Error: Item id is not provided",
                });
            }
            if (itemName == null) {
                return res.status(400).json({
                    message: "Error: New name is not provided",
                });
            }
            return res.json(await db.updateItemName(itemId, itemName));
        } catch (error) {
            return res.status(500).json({ message: `${error}` });
        }
    }

    // Method to get items with a specific size
    async getItemWithSize(req, res) {
        try {
            const { size } = req.body;
            if (size == null) {
                return res.status(400).json({
                    message: "Error: size is not provided",
                });
            }
            return res.json(await db.getItemWithSize(size));
        } catch (error) {
            return res.status(500).json({ message: `${error}` });
        }
    }
}

module.exports = new ShopController();
