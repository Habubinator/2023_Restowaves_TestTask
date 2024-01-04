const db = require("./dbPool");
const gShController = require("../controllers/gsheetsController");
/*
    1. Вытянуть список листов
    2. Пройтись по массиву
    Для каждой итерации:
        3. Проверить на сочетание с брендом, что есть в базе данных
        4. Добавить модель (название листа)
        5. Вытянуть список всех ключей и значений
        6. Парсить значения и создавать обьекты для каждого предмета (хранить указатели где-то в одном массиве)
        7. Не забыть перед добавлением обьекта в бд проверить есть ли такой обьект (кинуть запрос в бд и сверить значения)
        8. Добавлять для каждого обьекта значения в нужных таблицах бд    
*/
class databaseController {
    constructor() {
        this.sheets;
    }

    async getGoogleData() {
        // clear temp data
        this.sheets = new Map();

        // get array of google sheet titles and their rows value
        let tempSheetNames = await gShController.getGoogleSheets();
        for (let i = 0; i < tempSheetNames.length; i++) {
            const sheet = tempSheetNames[i];
            this.sheets.set(
                sheet.properties.title,
                await gShController.parseSheet(sheet.properties.title)
            );
        }
        return this.sheets;
    }

    async updateDBData() {
        this.getGoogleData().then(() => {
            this.sheets.forEach(async (value, key, map) => {
                let modelName = key;
                let modelId = await this.addModel(modelName);
                let brandId = await this.checkBrand(modelName);

                // iterating for each item map values
                for (let parsedMap of value) {
                    const columns = ["Імя", "Ціна", "Код товару"]; // filter for required fields\dynamic sizes values
                    this.addItem(
                        parsedMap.get(columns[2]),
                        parsedMap.get(columns[0]),
                        parsedMap.get(columns[1]),
                        modelId,
                        brandId
                    );

                    const sizes = new Array();
                    // iterating for sizes value
                    for (let [key, value] of parsedMap) {
                        if (!columns.includes(key)) {
                            sizes.push(key);
                        }
                    }
                    sizes.forEach(async (value) => {
                        let sizeId = await this.addSize(value);
                        this.addSizeItem(sizeId, parsedMap.get(columns[2]));
                    });
                }
            });
        });
    }

    async addModel(modelName) {
        const existingModel = await db.query(
            "SELECT * FROM model WHERE model_name = $1",
            [modelName]
        );

        if (existingModel.rows.length > 0) {
            // if model exist, return that model id
            return existingModel.rows[0].id;
        } else {
            // if model don't exist, make new one and return it's id
            const newModel = await db.query(
                "INSERT INTO model (model_name) VALUES ($1) RETURNING *",
                [modelName]
            );
            return newModel.rows[0].id;
        }
    }

    async addBrand(brandName) {
        const existingBrand = await db.query(
            "SELECT * FROM brand WHERE brand_name = $1",
            [brandName]
        );

        if (existingBrand.rows.length > 0) {
            // if brand exist, return that brand id
            return existingBrand.rows[0].id;
        } else {
            // if brand don't exist, make new one and return it's id
            const newBrand = await db.query(
                "INSERT INTO brand (brand_name) VALUES ($1) RETURNING *",
                [brandName]
            );
            return newBrand.rows[0].id;
        }
    }

    async checkBrand(modelName) {
        const existingBrand = await db.query("SELECT * FROM brand");
        for (let i = 0; i < existingBrand.rows.length; i++) {
            if (modelName.indexOf(existingBrand.rows[i].brand_name) != -1) {
                return existingBrand.rows[i].id;
            }
        }
        return null;
    }

    async addSize(size) {
        const existingSize = await db.query(
            "SELECT * FROM size WHERE shoe_size_ua = $1",
            [size]
        );

        if (existingSize.rows.length > 0) {
            return existingSize.rows[0].id;
        } else {
            const newSize = await db.query(
                "INSERT INTO size (shoe_size_ua) VALUES ($1) RETURNING *",
                [size]
            );
            return newSize.rows[0].id;
        }
    }

    async addItem(itemId, itemName, itemPrice, modelId, brandId) {
        const existingItem = await db.query(
            "SELECT * FROM item WHERE item_id = $1",
            [itemId]
        );

        if (existingItem.rows.length > 0) {
            return existingItem.rows[0].item_id;
        } else {
            const newItem = await db.query(
                "INSERT INTO item (item_id, item_name, item_price, model_id, brand_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [itemId, itemName, itemPrice, modelId, brandId]
            );
            return newItem.rows[0].item_id;
        }
    }

    async addSizeItem(size_id, item_id) {
        const existingSizeItem = await db.query(
            "SELECT * FROM sizes_items WHERE size_id = $1 AND item_id = $2",
            [size_id, item_id]
        );
        if (existingSizeItem.rows.length > 0) {
            return existingSizeItem.rows[0].id;
        } else {
            const newSize = await db.query(
                "INSERT INTO sizes_items (size_id, item_id) VALUES ($1, $2) RETURNING *",
                [size_id, item_id]
            );
            return newSize.rows[0].id;
        }
    }

    async getItemAll() {
        return (await db.query("SELECT * FROM item")).rows;
    }

    async getItemOne(itemId) {
        return (
            await db.query("SELECT * FROM item WHERE item_id = $1", [itemId])
        ).rows[0];
    }

    async updateItem(itemId, itemName) {
        return (
            await db.query(
                "UPDATE item SET item_name = $1 WHERE item_id = $2 RETURNING *",
                [itemName, itemId]
            )
        ).rows[0];
    }

    async getItemWithSize(size) {
        const items = await db.query(
            `SELECT item.*
            FROM item
            JOIN sizes_items ON item.item_id = sizes_items.item_id
            JOIN size ON sizes_items.size_id = size.id
            WHERE size.shoe_size_ua = $1`,
            [size]
        );
        return items.rows;
    }
}

module.exports = new databaseController();
