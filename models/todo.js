const mongoose = require("mongoose");
const { titleErrorMessage, subjectErrorMessage, descriptionErrorMessage } = require("../constants/constants");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [10, "Title must be at least 10 characters long"],
        maxlength: 100
    },
    subject: {
        type: String,
        required: [true, subjectErrorMessage],
        minlength: [10, "Subject must be at least 10 characters long"],
        maxlength: 300

    },
    description: {
        type: String,
        required: [true, descriptionErrorMessage],
        minlength: [20, "Description must be at least 20 characters long"],
        maxlength: 500
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    images: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});
const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;