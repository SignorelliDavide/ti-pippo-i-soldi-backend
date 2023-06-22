const express = require('express');
const sessionRouter = express.Router();
const { createNewSession } = require('../utils/session');
const prisma = require('../utils/db');
const isLoggedIn = require('../utils/passport');

sessionRouter.post('/create', isLoggedIn, async (req, res) => {
    console.log('Creating new session');
    const { user } = req.session.passport;
    const newSession = await createNewSession(user);
    res.json(newSession);
});

sessionRouter.post('/insert', isLoggedIn, async (req, res) => {
    const { player, session, cell } = req.body;
    res.json(await prisma.session.update({
        where: {
            id: session,
        },
        data: {
            [cell]: player,
        }
    }));
});

sessionRouter.get('/getFree', async (req, res) => {
    const freeSession = await prisma.session.findMany({
        where: {
            full: false,
        },
        orderBy: {
            id: 'desc',
        },
        take: 1,
    });
    res.json(freeSession);
});

module.exports = sessionRouter;