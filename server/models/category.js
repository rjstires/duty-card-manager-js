var mongoose = require('mongoose');
var Card = require('./card');

var categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

categorySchema.pre('remove', function (next) {
    console.log('**** removing cards associated with category');
    Card.remove({_category_id: this._id}).exec();
    next();
});

module.exports = mongoose.model('Category', categorySchema);
