const mongoose = require("mongoose");
const { titleErrorMessage, subjectErrorMessage, descriptionErrorMessage } = require("../lib/constants");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, titleErrorMessage],
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
        minlength: [10, "Description must be at least 20 characters long"],
        maxlength: 500
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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