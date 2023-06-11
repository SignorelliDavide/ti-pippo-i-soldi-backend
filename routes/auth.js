const express = require('express');
const passport = require('passport');
const authRouter = express.Router();
const isLoggedIn = require('../utils/passport');
const { createNewUser, findByEmail } = require('../utils/user');

authRouter.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (await findByEmail(email) != null) {
        console.log('Email is already used');
        res.json('Email is already used');
        return;
    }
    //console.log(name, email, password);
    const user = createNewUser(name, email, password);
    res.json(user);
});

authRouter.post('/login', passport.authenticate('local'), (req, res) => {
    const user = req.user;
    req.login(user, function (err) {
        if (err) { return res.status(401) }
        return res.status(200).json(user)
    });
});

authRouter.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).json('Ok ti sei sloggato');
    });
});

authRouter.get('/isLoggedIn', isLoggedIn, function (req, res) {
    res.status(200).json('Ok sei sloggato');
});


module.exports = authRouter;