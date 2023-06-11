const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { findByEmail } = require('./user');
const bcrypt = require('bcrypt');
const prisma = require('./db');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async function (email, password, done) {
            //console.log(email, password);
            const user = await findByEmail(email);
            if (!user) {
                return done(null, false, { message: 'Email not found' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        }
    )
);


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});

module.exports = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ "error": 'You must be logged in to do this.' });
}


exports.default = passport;