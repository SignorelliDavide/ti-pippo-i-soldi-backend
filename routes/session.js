const express = require('express');
const sessionRouter = express.Router();
const { createNewSession, findByUser } = require('../utils/session');
const prisma = require('../utils/db');
const isLoggedIn = require('../utils/passport');

sessionRouter.get('/create', isLoggedIn, async (req, res) => {
    const { user } = req.session.passport;
    const newSession = await createNewSession(user);
    res.json(newSession);
});

sessionRouter.post('/insert', isLoggedIn, async (req, res) => {
    const { cell } = req.body;
    const idSess = await findByUser(req.session.passport.user)
    let player;
    let cellValue = "cell" + cell;
    if (idSess[0].user1Id == req.session.passport.user)
        player = "X";
    else
        player = "O";
    await prisma.session.update({
        where: {
            id: idSess[0].id,
        },
        data: {
            [cellValue]: player,
        }
    });
});

sessionRouter.get('/sessionVerify', isLoggedIn, async (req, res) => {
    const idSess = await findByUser(req.session.passport.user)
    try {
        if (idSess[0].full == true)
            res.json(true);
        else
            res.json(false);
    } catch (error) {
        res.json(false);
    }
});

sessionRouter.get('/update', isLoggedIn, async (req, res) => {
    //console.log("update");
    try {
        const idSess = await findByUser(req.session.passport.user)
        const session = await prisma.session.findMany({
            where: {
                id: idSess[0].id,
            },
        });
        res.json(session);
    }
    catch (error) {
        res.json("error");
    }

});

sessionRouter.get('/getxIsNext', isLoggedIn, async (req, res) => {
    const idSess = await findByUser(req.session.passport.user)
    res.json(idSess[0].xIsNext);
});
sessionRouter.post('/setxIsNext', isLoggedIn, async (req, res) => {
    const idSess = await findByUser(req.session.passport.user)
    let x = idSess[0].xIsNext;
    await prisma.session.update({
        where: {
            id: idSess[0].id,
        },
        data: {
            xIsNext: !x,
        },
    });
});

sessionRouter.delete('/delete', isLoggedIn, async (req, res) => {
    try {
        const idSess = await findByUser(req.session.passport.user)
        await prisma.session.delete({
            where: {
                id: idSess[0].id,
            },
        });
        res.json("ok");
    }
    catch (error) {
        res.json("error");
    }
});

sessionRouter.get('/whoIsPlaying', isLoggedIn, async (req, res) => {
    try {
        const idSess = await findByUser(req.session.passport.user)
        const session = await prisma.session.findMany({
            where: {
                id: idSess[0].id,
            },
        });
        if (session[0].user1Id == req.session.passport.user)
            res.json("X");
        else
            res.json("O");
    }
    catch (error) {
        res.json("error");
    }
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