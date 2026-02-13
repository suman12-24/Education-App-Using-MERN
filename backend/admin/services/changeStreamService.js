const mongoose = require("mongoose");
const Notification = require("../../models/approvedSchoolUpdatesNotification"); // Correct model path

const initializeChangeStream = (app) => {
    const io = app.get("io");
    const db = mongoose.connection;

    db.once("open", () => {
        console.log("Connected to MongoDB - Change Stream Initialized");

        const schoolCollection = db.collection("schools");
        const changeStream = schoolCollection.watch();

        changeStream.on("change", async (change) => {
            console.log("Change detected:", change);

            let notificationData = {};
            let schoolName = "";

            // For operations that don't include the full document, fetch the school name
            if (change.operationType === "update" || change.operationType === "delete") {
                try {
                    const school = await db.collection("schools").findOne(
                        { _id: change.documentKey._id },
                        { projection: { name: 1 } }
                    );
                    schoolName = school ? school.name : "Unknown School";
                } catch (error) {
                    console.error("Error fetching school name:", error);
                    schoolName = "Unknown School";
                }
            }

            switch (change.operationType) {
                case "insert":
                    schoolName = change.fullDocument.name || "New School";
                    notificationData = {
                        schoolId: change.fullDocument._id,
                        schoolName: schoolName,
                        message: "A new school has been added.",
                        type: "insert",
                    };
                    break;

                case "update":
                    notificationData = {
                        schoolId: change.documentKey._id,
                        schoolName: schoolName,
                        message: `School details updated: ${Object.keys(change.updateDescription.updatedFields).join(", ")}`,
                        type: "update",
                    };
                    break;

                case "replace":
                    schoolName = change.fullDocument.name || "Updated School";
                    notificationData = {
                        schoolId: change.fullDocument._id,
                        schoolName: schoolName,
                        message: "A school document has been replaced.",
                        type: "replace",
                    };
                    break;

                case "delete":
                    notificationData = {
                        schoolId: change.documentKey._id,
                        schoolName: schoolName,
                        message: "A school has been deleted.",
                        type: "delete",
                    };
                    break;

                default:
                    console.log("Other change detected:", change);
                    return;
            }

            console.log("Notification data before saving:", notificationData);

            try {
                const notification = new Notification(notificationData);
                await notification.save();

                io.to("admin_room").emit("new_school_notification", notification);
                console.log("Notification saved & sent:", notification);
            } catch (error) {
                console.error("Error saving notification:", error);
            }
        });
    });
};

module.exports = initializeChangeStream;