var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        required: true,
        default: false
    },

    _category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
});

/**
 * Will deactivateAllCards then set the current
 * cards active value to true.
 * @param callback
 */
cardSchema.methods.activate = function (callback) {

    this.active = true;

    this.save(function (err, card) {
        if (err) {
            callback(err);
        } else {
            callback(undefined, card);
        }
    });
};

/**
 * Update all cards to have a active value of false.
 * @returns {Promise}
 */
cardSchema.statics.deactivateAllCards = function () {
    var cards = this;
    return new Promise(function (resolve, reject) {
        cards.update({}, {active: false}, {multi: true}, function (err, results) {
            if (err) {
                reject(err);
            }

            resolve(results);
        });
    });
};

module.exports = mongoose.model('Card', cardSchema);
