const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    ground: {
        type: String, required: true
    },
    groundid: {
        type: String, required: true
    },
    userid : {
        type: String, required: true
    },
    selectedDate: {
        type: String, required: true
    },
    fromtime: {
        type: String, required: true
    },
    totime: {
        type: String, required: true
    },
    totalamount: {
        type: Number, required: true
    },
    totalhours: {
        type: Number, required: true
    },
    transactionId: {
        type: String, required: true
    },
    status: {
        type: String, required: true, default: 'rezervat'
    }
}, {
    timestamps: true,

})

const bookingmodel = mongoose.model('bookings',bookingSchema)
module.exports= bookingmodel;