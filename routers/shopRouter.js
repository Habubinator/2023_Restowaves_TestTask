const Router = require("express");
const controller = require("../controllers/shopController");
const router = new Router();

// Route to get all items
router.get("/get-all", controller.getItemAll);

// Route to get a single item by ID
router.get("/get-one", controller.getItemOne);

// Route to update item name by ID
router.put("/change-item", controller.updateItemName);

// Route to get items with a specific size
router.get("/get-by-size", controller.getItemWithSize);

module.exports = router;
