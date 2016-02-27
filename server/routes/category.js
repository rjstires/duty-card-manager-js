var _ = require('lodash');
var Category = new require('./../models/category'); //TODO We're using NEW here to fix an IDE issue. Is this causing a problem?

module.exports = function(express, app){
    var router = express.Router();

    router.use(function (req, res, next) {
        console.log('%s: %s', req.method, req.originalUrl);
        next();
    });

    router.route('/')
        .get(function (req, res) {
            // INDEX

            Category.find(function (err, data) {
                if(err){
                    res.json({message: 'Error finding category.', error: err});
                }

                res.json({data: data});
            });
        })
        .post(function (req, res) {
            var category = new Category(req.body);

            category.save(function (err) {
                if (err) {
                    res.json({message: 'Error saving category.', error: err});
                } else {
                    res.json({message: 'Successfully saved category.', data: category});
                }
            });
        });


    router.use('/:id', function (req, res, next) {
        Category.findById(req.params.id, function (err, data) {
            if(err){
                res.json({message: 'Error finding category.', error: err});
                return;
            }

            if(data){
                req.category = data;
                next();
            } else {
                res.json({message: 'Unable to locate category.'});
            }
        });
    });

    router.route('/:id')
        .get(function (req, res, next) {
            // SHOW

            res.json(req.category);
        })
        .put(function (req, res) {
            // UPDATE
            var category = req.category;

            _.merge(category, req.body);
            category.save(function (err) {
                if(err){
                    res.json({message: 'Unable to update category.', error: err});
                }

                res.json({message: 'Category updated successfully.', data: category});
            });
        })
        .delete(function (req, res) {
            Category.findById(req.params.id, function (err, category) {
                category.remove();
                /*
                 TODO https://github.com/Automattic/mongoose/issues/1241
                 Unless we use the DOCUMENT.remove() below, the pre remove
                 function will not fire, and we will not delete children.
                 */

                if(err){
                    res.json({message: 'Error deleting category.', error: err});
                }

                res.json({message: 'Category successfully deleted.'});
            });
            // DELETE
        });

    app.use('/category', router);
};
