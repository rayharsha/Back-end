const Todo = require("../models/todo");
const getResponse = require("../dto/response");
const { getValidationErrors } = require("../lib/utility");

const saveTodo = async (req, res) => {
    const response = getResponse();
    try {
        const body = req.body;
        const user = req.user;
        console.log("body", body);
        const todo = new Todo({
            title: body.title,
            subject: body.subject,
            description: body.description,
            userId: user._id,
        });
        const savedTodo = await todo.save();
        response.data = savedTodo
        response.message = "Todo saved successfully...";
        res.status(201).send(response);
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    }
}
const updateTodo = async (req, res) => {
    const response = getResponse();
    const id = req.params.id;
    const updateData = req.body;
    try {
        await validateTodo(req, res, response);
        const updateTodo = await
            Todo.findByIdAndUpdate(
                id, updateData,
                { new: true, runValidators: true }
            );
        response.data = updateTodo;
        response.message = "Todo Updated successfully"
        res.status(200).send(response);
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    }
}
const deleteTodo = async (req, res) => {
    const response = getResponse();
    const id = req.params.id;
    try {
        await validateTodo(req, res, response);
        await Todo.findByIdAndDelete(id)
        response.message = "Todo deleted successfully"
        res.status(200).send(response);
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    };
};
const getTodos = async (req, res) => {
    const response = getResponse();
    const id = req.params.id;
    try {
        const todos = id ? await Todo.findOne({ _id: id, userId: req.user._id }) : await Todo.find({ userId: req.user._id });
        response.data = todos;
        response.message = todos ? "Todos fetched successfully " : "Todo not found";
        res.status(todos ? 200 : 400).send(response);
    } catch (error) {
        const errorObj = getValidationErrors(error);
        response.message = errorObj.errors;
        res.status(errorObj.code).send(response);
    };
}
const validateTodo = async (req, res, response) => {
    const todo = await Todo.findOne({
        _id: id,
        userId: req.user._id
    });
    if (!todo) {
        response.message = ["Unauthorized access."];
        res.status(403).send(response);
    }
}
module.exports = {
    saveTodo,
    updateTodo,
    deleteTodo,
    getTodos
}