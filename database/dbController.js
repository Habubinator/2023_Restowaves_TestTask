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

    async addModel(modelName) {
        return (
            await db.query(
                "INSERT INTO model (modelName) VALUES ($1) RETURNING *",
                [modelName]
            )
        ).rows[0];
    }

    async addBrand(brandName) {
        return (
            await db.query(
                "INSERT INTO brand (brandName) VALUES ($1) RETURNING *",
                [brandName]
            )
        ).rows[0];
    }
    async addSize(size) {
        return (
            await db.query(
                "INSERT INTO size (shoeSizeUA) VALUES ($1) RETURNING *",
                [size]
            )
        ).rows[0];
    }
    async addItem(itemId, itemName, itemPrice, modelId, brandId) {
        return (
            await db.query(
                "INSERT INTO item (itemId, itemName, itemPrice, modelId, brandId) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [itemId, itemName, itemPrice, modelId, brandId]
            )
        ).rows[0];
    }

    async getItemAll() {
        return (await db.query("SELECT * FROM item")).rows;
    }

    async getItemOne(itemId) {
        return (
            await db.query("SELECT * FROM item WHERE itemId = $1", [itemId])
        ).rows[0];
    }

    async updateItem(itemId, itemName) {
        return (
            await db.query(
                "UPDATE item SET itemName = $1 WHERE itemId = $2 RETURNING *",
                [itemName, itemId]
            )
        ).rows[0];
    }
}

module.exports = new databaseController();
