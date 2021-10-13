const express = require('express');
const router = express.Router();
const passport = require('passport');
const userService = require('../services/user.service');
const { SECRET } = require('../config');

router.post('/login', 
passport.authenticate('local', {failureRedirect: '/login.html'}),
 (req, res) => {
     try{
        const {_id, firstName, lastName, city, stret, isAdmin} = req.session.passport.user;
        return res.json({_id, firstName, lastName, city, stret, isAdmin});
     }
     catch (err) {
        return res.sendStatus(400);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const isUser = await userService.userExist(req.body);
        if(isUser){
            return res.sendStatus(400);
        }
        else{
            const user = await userService.addUser(req.body);
            res.sendStatus(200);
        }
    } catch (err) {
        return res.sendStatus(400);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.sendStatus(400);
        }
        req.logout();
        res.cookie('connect.sid', req.cookies['connect.sid'], {maxAge: -1});
        res.sendStatus(200);
    });
});

module.exports = router;