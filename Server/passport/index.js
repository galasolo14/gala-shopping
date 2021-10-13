const {createHashedPassword} = require('../utils/index');
const mongoose = require('mongoose');
const userSchema = require('../models/users.model');
const User = mongoose.model('User', userSchema);

module.exports = {
    localStrategyHandler: (email, password, done) => {
        const pass= createHashedPassword(password);
        User.findOne({ email , password: createHashedPassword(password)})
         .then(data => {
            const user = data.email;
            if (!user) {
                return done(null, false); // (failure)
            }
            return done(null, data); //(success)
         }).catch(err => {
             return done(err); //(failure)
         });
    },
    serializeUser: (user, done) => {
        done(null, user);
    },
    deserializeUser: (user, done) => {
        done(null, user);
       
    },
    isValid: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.status(401).send('Unauthorized request');
    }
}