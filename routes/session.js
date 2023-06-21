const express = require('express');
const sessionRouter = express.Router();
const { createNewSession } = require('../utils/session');
const prisma = require('../utils/db');


sessionRouter.post('/create', async (req, res) => {
    const { id1 } = req.body;
    const newSession = await createNewSession(id1);
    res.json(newSession);
});
sessionRouter.post('/insert', async (req, res) => {
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

module.exports = sessionRouter;