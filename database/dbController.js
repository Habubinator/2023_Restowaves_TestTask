const db = require("./dbPool");
const gShController = require("../controllers/gsheetsController");

class databaseController {
    constructor() {
        this.sheets; // Property to store parsed Google Sheets data
    }

    // Function to retrieve data from Google Sheets and parse it
    async getGoogleData() {
        // Clear temporary data
        this.sheets = new Map();

        // Retrieve an array of Google sheet titles and their rows value
        let tempSheetNames = await gShController.getGoogleSheets();

        // Parse each sheet and store it in the 'sheets' Map
        for (let i = 0; i < tempSheetNames.length; i++) {
            const sheet = tempSheetNames[i];
            // Store sheet title and its parsed rows in the Map
            this.sheets.set(
                sheet.properties.title,
                await gShController.parseSheet(sheet.properties.title)
            );
        }
        return this.sheets; // Return the parsed Google Sheets data
    }

    // Function to update the database with data from Google Sheets
    async updateDBData() {
        this.getGoogleData().then(() => {
            this.sheets.forEach(async (value, key, map) => {
                let modelName = key;
                let modelId = await this.addModel(modelName); // Add or retrieve model ID
                let brandId = await this.checkBrand(modelName); // Check for existing brand or create a new one

                // Iterating for each item in map values
                for (let parsedMap of value) {
                    const columns = ["Імя", "Ціна", "Код товару"]; // Filter for required fields/dynamic sizes values
                    this.addItem(
                        parsedMap.get(columns[2]),
                        parsedMap.get(columns[0]),
                        parsedMap.get(columns[1]),
                        modelId,
                        brandId
                    );

                    const sizes = new Array();
                    // Iterating for sizes value
                    for (let [key, value] of parsedMap) {
                        if (!columns.includes(key)) {
                            sizes.push(key);
                        }
                    }
                    sizes.forEach(async (value) => {
                        let sizeId = await this.addSize(value); // Add or retrieve size ID
                        this.addSizeItem(sizeId, parsedMap.get(columns[2])); // Add size-item association
                    });
                }
            });
        });
    }

    // Method to add or retrieve a model ID
    async addModel(modelName) {
        const existingModel = await db.query(
            "SELECT * FROM model WHERE model_name = $1",
            [modelName]
        );

        if (existingModel.rows.length > 0) {
            // If model exists, return its ID
            return existingModel.rows[0].id;
        } else {
            // If model doesn't exist, create a new one and return its ID
            const newModel = await db.query(
                "INSERT INTO model (model_name) VALUES ($1) RETURNING *",
                [modelName]
            );
            return newModel.rows[0].id;
        }
    }

    // Method to add or retrieve a brand ID
    async addBrand(brandName) {
        const existingBrand = await db.query(
            "SELECT * FROM brand WHERE brand_name = $1",
            [brandName]
        );

        if (existingBrand.rows.length > 0) {
            // If brand exists, return its ID
            return existingBrand.rows[0].id;
        } else {
            // If brand doesn't exist, create a new one and return its ID
            const newBrand = await db.query(
                "INSERT INTO brand (brand_name) VALUES ($1) RETURNING *",
                [brandName]
            );
            return newBrand.rows[0].id;
        }
    }

    // Method to check for a brand existence based on the model name
    async checkBrand(modelName) {
        const existingBrand = await db.query("SELECT * FROM brand");
        for (let i = 0; i < existingBrand.rows.length; i++) {
            if (modelName.indexOf(existingBrand.rows[i].brand_name) !== -1) {
                return existingBrand.rows[i].id;
            }
        }
        return null; // Return null if no brand is found
    }

    // Method to add or retrieve a size ID
    async addSize(size) {
        const existingSize = await db.query(
            "SELECT * FROM size WHERE shoe_size_ua = $1",
            [size]
        );

        if (existingSize.rows.length > 0) {
            // If size exists, return its ID
            return existingSize.rows[0].id;
        } else {
            // If size doesn't exist, create a new one and return its ID
            const newSize = await db.query(
                "INSERT INTO size (shoe_size_ua) VALUES ($1) RETURNING *",
                [size]
            );
            return newSize.rows[0].id;
        }
    }

    // Method to add an item to the database
    async addItem(itemId, itemName, itemPrice, modelId, brandId) {
        const existingItem = await db.query(
            "SELECT * FROM item WHERE item_id = $1",
            [itemId]
        );

        if (existingItem.rows.length > 0) {
            // If item exists, return its ID
            return existingItem.rows[0].item_id;
        } else {
            // If item doesn't exist, create a new one and return its ID
            const newItem = await db.query(
                "INSERT INTO item (item_id, item_name, item_price, model_id, brand_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [itemId, itemName, itemPrice, modelId, brandId]
            );
            return newItem.rows[0].item_id;
        }
    }

    // Method to add a size-item association
    async addSizeItem(size_id, item_id) {
        const existingSizeItem = await db.query(
            "SELECT * FROM sizes_items WHERE size_id = $1 AND item_id = $2",
            [size_id, item_id]
        );
        if (existingSizeItem.rows.length > 0) {
            // If the association exists, return its ID
            return existingSizeItem.rows[0].id;
        } else {
            // If the association doesn't exist, create a new one and return its ID
            const newSize = await db.query(
                "INSERT INTO sizes_items (size_id, item_id) VALUES ($1, $2) RETURNING *",
                [size_id, item_id]
            );
            return newSize.rows[0].id;
        }
    }

    // Method to retrieve all items from the database
    async getItemAll() {
        return (await db.query("SELECT * FROM item")).rows;
    }

    // Method to retrieve a specific item based on its ID
    async getItemOne(itemId) {
        return (
            await db.query("SELECT * FROM item WHERE item_id = $1", [itemId])
        ).rows[0];
    }

    // Method to update an item's name based on its ID
    async updateItemName(itemId, itemName) {
        return (
            await db.query(
                "UPDATE item SET item_name = $1 WHERE item_id = $2 RETURNING *",
                [itemName, itemId]
            )
        ).rows[0];
    }

    // Method to retrieve items with a specific size
    async getItemWithSize(size) {
        const items = await db.query(
            `SELECT item.*
            FROM item
            JOIN sizes_items ON item.item_id = sizes_items.item_id
            JOIN size ON sizes_items.size_id = size.id
            WHERE size.shoe_size_ua = $1`,
            [size]
        );
        return items.rows; // Return the items that match the specified size
    }
}

module.exports = new databaseController(); // Export an instance of the database controller
