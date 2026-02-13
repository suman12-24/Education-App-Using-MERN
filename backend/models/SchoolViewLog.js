// SchoolViewLog Schema
const mongoose = require('mongoose');

const schoolViewLogSchema = new mongoose.Schema({
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
    viewCount: {
        type: Number,
        default: 1
    },
    lastViewedAt: {
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

const SchoolViewLog = mongoose.model("SchoolViewLog", schoolViewLogSchema);

module.exports = SchoolViewLog;