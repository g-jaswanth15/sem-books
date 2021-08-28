const LocalStrategy = require('passport-local').Strategy;

const user = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'username'},(username,password,done)=>{
            //Matching the user
            user.findOne({username:username})
            .then(user =>{
                if(!user){
                    return done(null,false,{message:'the username is not registered under your email'})
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                      return done(null, user);
                    } else {
                      return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
    passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
          done(err, user);
        });
    });
}