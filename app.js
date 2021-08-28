const express = require('express')
const app = express()
const mongoose =  require('mongoose')
const expressLayouts =  require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

require('./authenticate/pass')(passport);

const dbURI = 'mongodb+srv://delta-task:delta3@cluster0.jo6mm.mongodb.net/delta-hackathon?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('mongodbconnected..'))

app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))


app.use(expressLayouts)
app.set('view engine','ejs')

//express-session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport 
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash())

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.listen(3000)

app.use('/',require('./router/index'))