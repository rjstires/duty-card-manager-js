var _ = require('lodash');
var Card = new require('./../models/card');

module.exports = function (express, app) {
    var router = express.Router();
    router.use(function (req, res, next) {

        var cards = Card.find({_category_id: req.category._id}, function (err, data) {
            if (err) {
                throw err;
            }

            req.category.cards = data;
            next();
        });
    });

    router.route('/')
        .get(function (req, res) {
            // INDEX

            res.json({
                category: req.category,
                cards: req.category.cards
            });
        })
        .post(function (req, res) {
            // CREATE

            var card = new Card({
                _category_id: req.category._id,
                active: false,
                name: req.body.name
            });

            card.save(function (err) {
                if (err) {
                    res.json({message: 'Error saving card.', error: err});
                } else {
                    res.json({message: 'Saved card successfully.', card: card});
                }
            });

        });

    router.use('/:id', function (req, res, next) {
        var card = Card.findById(req.params.id, function (err, data) {
            if (err) {
                res.json({message: 'Error finding card.', error: err});
            }

            if (data) {
                req.card = data;
                next();
            }
        });

    });

    router.route('/:id')
        .get(function (req, res) {
            // SHOW
            res.json(req.card);
        })
        .put(function (req, res) {
            var card = req.card;
            _.merge(card, req.body);

            card.save(function (err) {
                if (err) {
                    res.json({message: 'Error saving card.'});
                }
                res.json(card);
            });
        })
        .delete(function (req, res) {
            var card = Card.findById(req.params.id, function (err, data) {
                if (err) {
                    res.json({message: 'Error locating card.'});
                }

                card.remove(function (err) {
                    if (err) {
                        res.json({message: 'Error deleting card.'});
                    } else {
                        res.json({message: 'Card successfully deleted.'});
                    }
                });
            });
        });

    router.route('/:id/activate')
        .post(function (req, res) {
            Card.deactivateAllCards()
                .then(function (results) {
                    req.card.activate(function (err, card) {
                        if (err) {
                            res.json({message: 'Error activating card.', error: err});
                        }

                        res.json({message: 'Card activated successfully.', card: card});
                    });
                })
                .catch(function (error) {
                    res.json({message: 'Error deactivating cards.', error: error});
                });

        });

    app.use('/category/:cat_id/card', router);
};
