var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/User');
var Order = require('../models/Order');
var OrderEntry = require('../models/OrderEntry');
var Item = require('../models/Item');


router.get('/', function (req, res) {
    if(!req.user){
        res.redirect('/account');
    }
    Order.findOne({
        closed: false
    }, function(err, order){
        res.render('index', { user : req.user, order: order });
    });
});

router.get('/newlist', function(req, res){
    res.redirect('/');
});

router.post('/newlist', function (req, res, next){
    if(!req.user){
        res.redirect('/account');
    }

    Order.create({
        date: Date.now()
    }, function(err, order) {
        if (err) return next(err);
        res.render('index', {user: req.user, order: order});
    });
});

router.post('/joinlist', function (req, res, next) {
    if(!req.user){
        res.redirect('/account');
    }
    console.log(req.body)
    Order.findOne({
        closed: false
    }, function(err, order){
        OrderEntry.create({
            user: req.user,
            veggie: req.body.veggie ? true : false,
            eggs: req.body.eggs ? true : false,
            beef: req.body.meat,
            drink: req.body.drink ? true : false
        }, function (err, entry){
            order.items.push(entry);
            order.save();
            res.render('index', { user : req.user, order: order });
        });
    });
});

router.get('/leavelist', function (req, res, next) {
    Order.findOne({
        closed: false
    }, function (err, order){
        order.items.forEach(elem => {
            if (elem.user.username == req.user.username) {
                var idx = order.items.indexOf(elem);
                order.items.splice(idx, 1);
                order.save();
            }
        });
        res.redirect('/');
    });
});

router.get('/removeuser', function (req, res, next) {
    Order.findOne({
        closed: false
    }, function (err, order){
        order.items.forEach(elem => {
            if (elem.user.username == req.query.username) {
                var idx = order.items.indexOf(elem);
                order.items.splice(idx, 1);
                order.save();
            }
        });
        res.redirect('/');
    });
});

module.exports = router;
