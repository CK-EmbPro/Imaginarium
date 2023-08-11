const mongoose = require('mongoose');
const Schema = mongoose.Schema

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },

    companyName: {
        type: String,
        required: true,
    },

    serviceName: {
        type: String,
        required: true,
    },

    currLocation: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("ContactSchema", contactSchema)