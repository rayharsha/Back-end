const express = require("express");
const router = express.Router();
const { saveTodo,  updateTodo, deleteTodo, getTodos } = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

//Add, Edit, Update, Delete, View with pagenation
router.post("/save", authMiddleware, saveTodo);
router.put("/update/:id", authMiddleware, updateTodo);
router.delete("/delete/:id", authMiddleware, deleteTodo);
router.get("/:id", authMiddleware, getTodos);
router.get("/", authMiddleware, getTodos);

module.exports = router;