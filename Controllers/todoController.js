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
const editTodo = (req, res) => {


}

const updateTodo = (req, res) => {


}

const deleteTodo = (req, res) => {


}

const getTodos = (req, res) => {


}



module.exports = {
    saveTodo,
    editTodo,
    updateTodo,
    deleteTodo,
    getTodos
}