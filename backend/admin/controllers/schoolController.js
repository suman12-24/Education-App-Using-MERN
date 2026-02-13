const School = require('../../models/schoolDetailsModel');
const mongoose = require("mongoose");
const SchoolNotification = require('../../models/SchoolNotification');
const Notification = require('../../models/approvedSchoolUpdatesNotification');
const controller_view_all_school = async (req, res) => {
    try {
        // Optional filters from query parameters
        const { isApprovedByAdmin, page = 1, limit = 10 } = req.query;

        // Build query object
        const query = {};
        if (isApprovedByAdmin !== undefined) {
            query.isApprovedByAdmin = isApprovedByAdmin === 'true';
        }

        // Convert page and limit to integers and ensure they are valid
        const pageNumber = Math.max(1, parseInt(page, 10)); // Ensure page is at least 1
        const limitNumber = Math.max(1, parseInt(limit, 10)); // Ensure limit is at least 1

        // Fetch schools with pagination
        const schools = await School.find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Count total schools for pagination info
        const totalSchools = await School.countDocuments(query);

        // Render the view with the schools and pagination info
        res.render('pages/school_view_all', {
            schools, // Pass the list of schools
            pagination: {
                total: totalSchools,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalSchools / limitNumber),
            },
        });
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const controller_view_all_approved_school = async (req, res) => {
    try {
        // Pagination from query parameters
        const { page = 1, limit = 10 } = req.query;

        // Fixed query: only fetch approved schools
        const query = { isApprovedByAdmin: true };

        // Convert page and limit to integers and ensure they are valid
        const pageNumber = Math.max(1, parseInt(page, 10));
        const limitNumber = Math.max(1, parseInt(limit, 10));

        // Fetch approved schools with pagination
        const schools = await School.find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Count total approved schools for pagination info
        const totalSchools = await School.countDocuments(query);

        // Render the view with the schools and pagination info
        res.render('pages/school_view_all_approved', {
            schools,
            pagination: {
                total: totalSchools,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalSchools / limitNumber),
            },
        });
    } catch (error) {
        console.error('Error fetching approved schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const controller_view_all_pending_school = async (req, res) => {
    try {
        // Pagination from query parameters
        const { page = 1, limit = 10 } = req.query;

        // Fixed query: only fetch not approved schools
        const query = { isApprovedByAdmin: false };

        // Convert page and limit to integers and ensure they are valid
        const pageNumber = Math.max(1, parseInt(page, 10));
        const limitNumber = Math.max(1, parseInt(limit, 10));

        // Fetch approved schools with pagination
        const schools = await School.find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Count total approved schools for pagination info
        const totalSchools = await School.countDocuments(query);

        // Render the view with the schools and pagination info
        res.render('pages/school_view_all_pending', {
            schools,
            pagination: {
                total: totalSchools,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalSchools / limitNumber),
            },
        });
    } catch (error) {
        console.error('Error fetching approved schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const controller_school_details = async (req, res) => {
    try {
        const schoolId = req.query.id;
        console.log("School Id:", schoolId);

        if (!schoolId) {
            return res.status(400).send("School ID is required");
        }

        // Fetch school details from the database
        const school = await School.findById(schoolId);
        console.log('school', school);
        if (!school) {
            return res.status(404).send("School not found");
        }

        // Render the school details page and pass the fetched school data
        res.render('pages/school_details', { school });
    } catch (error) {
        console.error("Error fetching school details:", error);
        res.status(500).send("Internal Server Error");
    }
};

const controller_school_approve_deactivate = async (req, res) => {
    try {

        const { schoolId } = req.body;


        if (!schoolId) {
            return res.status(400).json({ success: false, message: "School ID is required" });
        }

        // Fetch school details from the database
        const school = await School.findById(schoolId);
        const approvalStatus = !school.isApprovedByAdmin;
        console.log("approvalStatus", approvalStatus);
        // Update status using findByIdAndUpdate (Atomic operation)
        const updatedSchool = await School.findByIdAndUpdate(
            schoolId,
            { $set: { isApprovedByAdmin: approvalStatus } },  // Efficient update
            { new: true }  // Return updated document
        );

        if (!updatedSchool) {
            return res.status(404).json({ success: false, message: "School not found" });
        }

        res.json({ success: true, newStatus: updatedSchool.isApprovedByAdmin });
    } catch (error) {
        console.error("Error updating school status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const controller_image_approve_deactivate = async (req, res) => {
    try {
        const { imageName, schoolId } = req.body;

        if (!imageName || !schoolId) {
            return res.status(400).json({ success: false, message: "Image name and School ID are required" });
        }

        // First find the school to check if the image exists and get its current status
        const school = await School.findById(schoolId);

        if (!school) {
            return res.status(404).json({ success: false, message: "School not found" });
        }

        // Find the image by name instead of ID
        const imageItem = school.imageGallery.find(img => img.image === imageName);

        if (!imageItem) {
            return res.status(404).json({ success: false, message: "Image not found in gallery" });
        }

        const currentStatus = imageItem.isApproved;
        const newStatus = !currentStatus;

        // Use findOneAndUpdate with arrayFilters targeting the image name
        const result = await School.findOneAndUpdate(
            { _id: schoolId },
            { $set: { "imageGallery.$[elem].isApproved": newStatus } },
            {
                arrayFilters: [{ "elem.image": imageName }],
                new: true,
                // These options bypass version checking
                upsert: false,
                runValidators: false,
                strict: false
            }
        );

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Failed to update image status"
            });
        }

        res.json({
            success: true,
            message: "Image approval status updated successfully",
            imageName: imageName,
            previousStatus: currentStatus,
            newStatus: newStatus
        });
    } catch (error) {
        console.error("Error updating image status:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const controller_approve_disapprove_profile_cover_image = async (req, res) => {
    try {
        const { schoolId, imageType } = req.body;

        if (!schoolId || !imageType) {
            return res.status(400).json({ success: false, message: "School ID and image type are required" });
        }

        // Fetch school details from the database
        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ success: false, message: "School not found" });
        }

        // Determine which field to update based on image type
        let newApprovalStatus;
        if (imageType === "profile") {
            newApprovalStatus = !school.profilePicture.isApproved;
            school.profilePicture.isApproved = newApprovalStatus;
        } else if (imageType === "cover") {
            newApprovalStatus = !school.coverPicture.isApproved;
            school.coverPicture.isApproved = newApprovalStatus;
        } else {
            return res.status(400).json({ success: false, message: "Invalid image type" });
        }

        // Save the updated school data
        await school.save();

        res.json({ success: true, newStatus: newApprovalStatus });
    } catch (error) {
        console.error("Error updating image approval status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const approve_Disapprove_SuccessStory_image = async (req, res) => {
    try {
        const { schoolId, storyId, approve } = req.body;

        if (!schoolId || !storyId) {
            return res.status(400).json({ success: false, message: "School ID and Story ID are required" });
        }

        // Find the school and update the specific story's approval status
        const updatedSchool = await School.findOneAndUpdate(
            { _id: schoolId, "successStories._id": storyId },
            { $set: { "successStories.$.image.isApproved": approve } },
            { new: true }
        );

        if (!updatedSchool) {
            return res.status(404).json({ success: false, message: "School or Story not found" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error updating success story:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const notification_For_School_Register_Controller = async (req, res) => {
    try {
        const notifications = await SchoolNotification.find()
            .sort({ timestamp: -1 }) // Get latest notifications first
            .limit(10); // Limit to 10 notifications
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching notifications", error });
    }
}

const school_update_history_controller = async (req, res) => {
    try {
        // Fetch notifications sorted by createdAt (latest first)
        const notifications = await Notification.find().sort({ createdAt: -1 });

        // Render the page with notifications
        res.render("pages/school_update_history", { notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).send("Internal Server Error");
    }
};

const school_update_notification = async (req, res) => {
    try {
        // Fetch notifications sorted by createdAt (latest first)
        const notifications = await Notification.find().sort({ createdAt: -1 });

        // Ensure the response is in JSON format with the expected structure
        res.json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// Add this to your controllers file where the school_update_history_controller is defined
const delete_notifications_controller = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "No notification IDs provided" });
        }

        // Delete multiple notifications by ID
        const result = await Notification.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount > 0) {
            return res.status(200).json({
                success: true,
                message: `Successfully deleted ${result.deletedCount} notification(s)`
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No notifications were deleted"
            });
        }
    } catch (error) {
        console.error("Error deleting notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const read_notification_controller = async (req, res) => {
    try {
        const { notificationId, schoolId } = req.body;

        // Validate required parameters
        if (!notificationId || !schoolId) {
            return res.status(400).json({
                success: false,
                message: 'Notification ID and School ID are required'
            });
        }

        // Update the notification to mark it as read
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            redirectUrl: `/admin/school-details?id=${schoolId}`
        });
    } catch (error) {
        console.error('Error updating notification status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
















module.exports = {
    controller_view_all_school, controller_school_details,
    controller_school_approve_deactivate, controller_image_approve_deactivate,
    controller_approve_disapprove_profile_cover_image,
    approve_Disapprove_SuccessStory_image, notification_For_School_Register_Controller,
    school_update_history_controller, delete_notifications_controller,
    read_notification_controller, controller_view_all_approved_school,
    controller_view_all_pending_school, school_update_notification
};
