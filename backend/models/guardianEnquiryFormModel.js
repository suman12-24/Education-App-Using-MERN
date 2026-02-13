const mongoose = require("mongoose");

const enquiryFormSchema = new mongoose.Schema({
    guardianLoginEmail: { type: String, default: null },
    school_id: { type: String, default: null },
    candidateDetails: {
        firstName: { type: String, default: null },
        middleName: { type: String, default: null },
        surName: { type: String, default: null },
        dateOfBirth: { type: Date, default: null },
        placeOfBirth: { type: String, default: null },
        nationality: { type: String, default: null },
        stateOfDomicile: { type: String, default: null },
        gender: { type: String, enum: ["Male", "Female"], default: null },
        session: { type: String, default: null },
        classAppliedFor: { type: String, default: null },
        currentClass: { type: String, default: null },
        academicDetails: {
            previousSchoolName: { type: String, default: null },
            previousSchoolCity: { type: String, default: null },
            previousPercentage: { type: Number, default: null },
            previousBoard: { type: String, default: null },
            previousStream: { type: String, default: null },
            reasonForLeaving: { type: String, default: null }
        },
        hasSiblingsInSchool: { type: Boolean, default: null }
    },
    fatherDetails: {
        firstName: { type: String, default: null },
        middleName: { type: String, default: null },
        surName: { type: String, default: null },
        email: { type: String, default: null },
        mobile: { type: String, default: null },
        occupation: {
            type: String,
            enum: ["Service", "PSU Employee", "Business", "Self Employed", "Govt. Employee", "Unemployed"],
            default: null
        },
        organization: { type: String, default: null },
        designation: { type: String, default: null }
    },
    motherDetails: {
        firstName: { type: String, default: null },
        middleName: { type: String, default: null },
        surName: { type: String, default: null },
        email: { type: String, default: null },
        mobile: { type: String, default: null },
        occupation: {
            type: String,
            enum: ["Service", "PSU Employee", "Business", "Self Employed", "Govt. Employee", "Unemployed", "Housewife"],
            default: null
        },
        organization: { type: String, default: null },
        designation: { type: String, default: null }
    },
    address: {
        firstLine: { type: String, default: null },
        secondLine: { type: String, default: null },
        postOffice: { type: String, default: null },
        policeStation: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        pin: { type: String, default: null }
    },
    status: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("guardianEnquiryFormModel", enquiryFormSchema);
