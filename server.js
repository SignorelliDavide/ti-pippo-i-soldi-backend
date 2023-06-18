const express = require('express');
const app = express();
const port = 3000;
const authRouter = require('./routes/auth');
const sessionRouter = require('./routes/session');
const passport = require('passport');
const users = require('./routes/user')

const session = require('express-session');
app.use(
    session({
        name: 'session',
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 1 },
    }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', users)
app.use('/api/session', sessionRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});