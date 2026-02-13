const mongoose = require("mongoose");

const schoolNotificationSchema = new mongoose.Schema({

    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },

    message: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["unread", "read"],
        default: "unread"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("SchoolNotification", schoolNotificationSchema);
