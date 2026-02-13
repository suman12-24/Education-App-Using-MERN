const mongoose = require('mongoose');

// Schema for Admission Procedure
const admissionProcedureSchema = new mongoose.Schema({
    step: { type: String, default: '' },
    description: { type: String, default: '' },
});

// Schema for Success Story
const successStorySchema = new mongoose.Schema({
    image: {
        name: { type: String, default: '' }, // Name of the image file
        isApproved: { type: Boolean, default: false }, // Approval status for the image
    },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
});


// Schema for Facility Details
const facilityDetailsSchema = new mongoose.Schema({
    introduction: { type: String, default: '' }, // General introduction for the facility
    fields: [
        {
            id: { type: Number, default: 0 },
            title: { type: String, default: '' }, // Title of the field, e.g., "Painting and Sketching"
            description: { type: String, default: '' }, // Detailed description of the field
            image: { type: String, default: '' },
            disabled: { type: Boolean, default: false }
        },
    ],
});


// Schema for Reach Us
const reachUsSchema = new mongoose.Schema({
    address: {
        street: { type: String, default: '' },
        region: { type: String, default: '' },
        pin: { type: String, default: '' },
        district: { type: String, default: '' },
        state: { type: String, default: '' },
        googleLocation: {
            latitude: { type: Number, default: null },
            longitude: { type: Number, default: null },
        },
    },
    website: { type: String, default: '' },
    phones: [{ type: String, default: '' }],
    emails: [{ type: String, default: '' }],
});

// Schema for Image Gallery with Approval
const imageGallerySchema = new mongoose.Schema({
    image: { type: String, default: '' },
    isApproved: { type: Boolean, default: false },
});

const feeStructureSchema = new mongoose.Schema({
    fileName: { type: String, default: '' },
    isApproved: { type: Boolean, default: false },
});
const facilityInfoSchema = new mongoose.Schema({
    classes: { type: String, default: '' },
    staff: { type: String, default: '' },
    student: { type: String, default: '' },
});

const socialLinkSchema = new mongoose.Schema({
    facebook: { type: String, default: '' },
    x: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    youtube: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
});
// Main School Schema
const schoolSchema = new mongoose.Schema({
    loginEmail: {
        type: String,
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        required: true,
    },
    coverPicture: {
        image: { type: String, default: '' },
        isApproved: { type: Boolean, default: false }, // Approval for cover picture
    },
    profilePicture: {
        image: { type: String, default: '' },
        isApproved: { type: Boolean, default: false }, // Approval for profile picture
    },
    name: { type: String, default: '' },
    affiliatedTo: { type: String, default: '' },
    HSAffiliatedTo: { type: String, default: '' },
    admissionProcedure: { type: [admissionProcedureSchema], default: [] },
    imageGallery: { type: [imageGallerySchema], default: [] },
    successStories: { type: [successStorySchema], default: [] },
    aboutSchool: { type: String, default: '' },
    facilities:
    {
        ArtsAndCreativity: { type: facilityDetailsSchema, default: {} },
        AcademicFacilities: { type: facilityDetailsSchema, default: {} },
        SportsAndRecreation: { type: facilityDetailsSchema, default: {} },
        SafetyAndHygiene: { type: facilityDetailsSchema, default: {} },
        MentalSupport: { type: facilityDetailsSchema, default: {} },
        ConvenienceFacilities: { type: facilityDetailsSchema, default: {} },
        OutdoorLearning: { type: facilityDetailsSchema, default: {} },
        ScienceInnovation: { type: facilityDetailsSchema, default: {} },
    },
    reachUs: { type: reachUsSchema, default: {} },
    contactPersonName: {
        type: String,
        // required: true,
        trim: true
    },
    contactPersonPhone: {
        type: String,
        //  required: true
    },
    location: {
        type: {},
        //  required: true
    },
    feeStructure: { type: [feeStructureSchema], default: [] },
    facilitiesInfo: { type: [facilityInfoSchema], default: [] },
    socialLinks: {
        type: [socialLinkSchema],
        default: []
    },
    adminApproved: { type: Boolean, default: false },
    isApprovedByAdmin: { type: Boolean, default: false }, // New field for overall admin approval
    viewCount: { type: Number, default: 0 },
    searchViewCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('School', schoolSchema);
