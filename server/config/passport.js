const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// need db access to users table
const db = require('../models');

// Telling passport we want to use a Local Strategy.
// In other words, we want login with a username/email and password
passport.use(
  new LocalStrategy(
    // Our user will sign in using an email, rather than a 'username'
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      // When a user tries to sign in this code runs
      try {
        db.user.findOne({
          where: {
            email
          }
        }).then(dbUser => {
          // If there's no user with the given email
          // If there is a user with the given email, but the password the user gives us is incorrect
          if (!dbUser || !dbUser.validPassword(password)) {
            return done(null, false, {
              message: 'Incorrect email or password.'
            });
          }
          // Login success
          return done(null, dbUser);
        }).catch((err) => console.error(err));
      } catch (error) {
        console.error(error);
      }
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
