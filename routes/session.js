const express = require('express');
const sessionRouter = express.Router();
const { createNewSession } = require('../utils/session');

sessionRouter.post('/create', async (req, res) => {
    const { id1 } = req.body;
    const newSession = await createNewSession(id1);
    res.json(newSession);
});

module.exports = sessionRouter;