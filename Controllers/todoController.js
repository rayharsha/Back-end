const Todo = require("../models/todo");
const getResponse = require("../dto/response");


const saveTodo = async (req, res) => {
    const response = getResponse();
    try {
        const body = req.body;
        console.log("body", body);

        const todo = new Todo({
            title: body.title,
            subject: body.subject,
            description: body.description,
        });
        const savedTodo = await todo.save();
        response.data = savedTodo
        // response.data = todo.save();
        response.message = "Todo saved successfully...";
        res.status(201).send(response);
    } catch (error) {
        // console.log(("Validation error caught"));
        const firestError = Object.values(error.errors || {})
        [0]?.message;
        response.message = firestError || "Invalid todo data"
        // error.message;
        res.status(400).send(response);
    }
}

const updateTodo = async (req, res) => {
    const response = getResponse();
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updateTodo = await
            Todo.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

        response.data = updateTodo;
        response.message = "Todo Updated successfully"
        res.status(200).send(response);
    } catch (error) {
        response.message = error.message || "update failed";
        res.status(400).send(response)
    }
}
const deleteTodo = async (req, res) => {
     const response = getResponse();
    const id = req.params.id;
    try {
        const deleteTodo = await
            Todo.findByIdAndDelete(
                id,
            )
        response.message = "Todo deleted successfully"
        res.status(200).send(response);
    } catch (error) {
        response.message = error.message || "todo delete failed"
        res.status(400).send(response);
    };
};

const getTodos = async (req, res) => {
    const response = getResponse();
    try {
        const todos = await
            Todo.find();
        response.data = todos;
        response.message = "Todos fetched successfully";

        res.status(200).send(response);
        const allTodos = req.body;
        Todo.find()
    } catch (error) {
        response.message = "Failed to fetch todos";
        res.status(400).send(response);
    };
}


module.exports = {
    saveTodo,
    updateTodo,
    deleteTodo,
    getTodos
}