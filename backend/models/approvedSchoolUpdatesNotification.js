const mongoose = require("mongoose");

const afterApproveNotificationSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    schoolName: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["update", "approval", "info"], required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", afterApproveNotificationSchema);

module.exports = Notification;