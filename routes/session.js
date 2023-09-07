const express = require('express');
const sessionRouter = express.Router();
const { createNewSession } = require('../utils/session');
const prisma = require('../utils/db');
const isLoggedIn = require('../utils/passport');

sessionRouter.get('/create', isLoggedIn, async (req, res) => {
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

sessionRouter.get('/joinSession', isLoggedIn, async (req, res) => {
    const user1found = await prisma.session.findMany({
        where: {
            user1Id: req.session.passport.user,
        },
    });
    const user2found = await prisma.session.findMany({
        where: {
            user2Id: req.session.passport.user,
        },
    });
    if (user1found.length != 0 || user2found.length != 0)
        return;
    let session;
    const freeSession = await prisma.session.findMany({
        where: {
            full: false,
        },
        orderBy: {
            id: 'desc',
        },
        take: 1,
    });
    if (freeSession.length == 0) {
        session = await createNewSession(req.session.passport.user);
    }
    else {
        session = freeSession
        await prisma.session.update({
            where: {
                id: session[0].id,
            },
            data: {
                user2Id: req.session.passport.user,
                full: true,
            },
        });
    }
    res.json(session);
});


module.exports = sessionRouter;