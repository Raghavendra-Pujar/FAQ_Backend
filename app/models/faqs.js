const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const faq = new Schema({
    faqId:{
        type:String,
        default: '',
        required: '',
        unique: true
    },
    title:{
        type: String,
        default: '',
        required: true
    },
    description:{
        type: String,
        default: '',
        required: true
    },
    createdOn:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('FaqSchema',faq);