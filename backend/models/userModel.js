const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
    },
    location: {
        type: {}  // You can structure it with specific fields like city, state, etc.
    },
    enquiries: [],
    favouriteSchools: [],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


