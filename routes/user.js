const express = require('express');
const userRoute = express.Router();
const { findById } = require('../utils/user');
const isLoggedIn = require('../utils/passport');
const prisma = require('../utils/db');

userRoute.get('/me', isLoggedIn, async (req, res) => {
    const { user } = req.session.passport;
    const found = await findById(user);
    res.json(found);
});

userRoute.post('/result', isLoggedIn, async (req, res) => {
    const { user } = req.session.passport;
    const result = req.body.result;
    const found = await findById(user);
    res.json(await prisma.user.update({
        where: {
            id: user,
        },
        data: {
            wins: found.wins + (result == 'win' ? 1 : 0),
            losses: found.losses + (result == 'lose' ? 1 : 0),
            tie: found.tie + (result == 'tie' ? 1 : 0),
        },
    }));
});

userRoute.get('/topfive', isLoggedIn, async (req, res) => {
    const topFive = await prisma.user.findMany({
        orderBy: {
            wins: 'desc',
        },
        take: 5,
    });
    res.json(topFive);
});

module.exports = userRoute;
