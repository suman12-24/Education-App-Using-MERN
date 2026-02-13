// SchoolSearchLog Schema
const mongoose = require("mongoose");

const schoolSearchLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },
    searchCount: {
        type: Number,
        default: 1
    },
    searchedAt: {
        type: Date,
        default: Date.now
    },
    lastSearchedAt: {
        type: Date,
        default: Date.now
    },
    // Added user details fields
    userName: {
        type: String,
        default: ''
    },
    userEmail: {
        type: String,
        default: ''
    },
    userPhone: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("SchoolSearchLog", schoolSearchLogSchema);