const mongoose = require('mongoose')

const terenSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true
    },
    price_per_hour:{
        type: Number,
        required: true
    },
    imageurls: [{
        type: String,
        required: true
    }],
    currentbookings: [],
    facilities: {
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    location:{
        type: String,
        required: true
    },

    type:{
        type: String,
        required: true
    }
    
}, {
    timestamps: true
})

const terenModel = mongoose.model('terens', terenSchema)

module.exports = terenModel