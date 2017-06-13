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

        var suggested = setSuggested(order);
        console.log(suggested);
        res.render('index', { user : req.user, order: order, suggested: suggested});
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
            beef: req.body.meat == 'beef' ? true : false,
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

function setSuggested(order){
    console.log('setSuggested: '+ order)
    var suggested = {
        alabeef: 0,
        alachicken: 0,
        extrabeef: 0,
        extrachicken: 0,
        eggs: 0,
        beans: 0,
        drinks: 0
    }

    var total = order.items.length;
    var countBeef = 0;
    var countChicken = 0;
    var countEggs = 0;
    var countBeans = Math.ceil(total/15);
    var countDrinks = 0;
    var countAla = Math.round(total/4) > 0 ? Math.round(total/4) : 1

    order.items.forEach(elem => {
        if(!elem.veggie){
            if(elem.beef){
                countBeef++;
            }
            else {
                countChicken++;
            }
        }
        else {
            if(elem.eggs){
                countEggs++;
            }
        }
        if(elem.drink){
            countDrinks++;
        }
    });

    if(countAla * 2 < total){
        suggested.extrabeef = Math.ceil(countBeef/2);
        suggested.extrachicken = Math.ceil(countChicken/2);
    }

    if(countAla <= countBeef){
        countBeef -= countAla;
        suggested.alabeef = countAla;
    } else {
        countChicken -= countAla;
        suggested.alachicken = countAla;
    }

    suggested.eggs = countEggs + total - (2*countAla);
    suggested.beans = countBeans;
    suggested.drinks = Math.ceil(countDrinks / 5);

    return suggested;
}

module.exports = router;
