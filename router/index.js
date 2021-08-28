const express = require('express')
const router = express.Router()
const userbook = require('../models/user')
const books = require('../models/book')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {ensureAuthenticated} = require('../authenticate/auth')

router.get('/',(req,res)=>{
    res.render('welcome')
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/signIn',(req,res)=>{
    res.render('signIn')
})

router.post('/signIn',(req,res)=>{
    let errors = []
    if(!req.body.username || !req.body.email || !req.body.password || !req.body.confirmpassword){
        errors.push({msg:'Please fill all requirments'})
    }
    if(req.body.password != req.body.confirmpassword){
        errors.push({msg:'passwords do not match'})
    }
    if(req.body.password.length < 6){
        errors.push({msg:'password should be atleast 6 characters'})
    }
    var check = req.body.email
    var length = check.length
    if(check.slice(length-9,length) !== '@nitt.edu'){
        errors.push({msg:'Please use nitt webmail'})
    }
    if(errors.length>0){
        res.render('signIn',{
            errors
        })
    }
    else{
        userbook.findOne({email:req.body.email})
        .then((user1)=>{
            if(user1){
                //user exsists
                errors.push({msg:'Email is already registered'})
                res.render('signIn',{errors})
            }
            else{
                userbook.findOne({username:req.body.username})
                    .then(user1=>{
                        if(user1){
                            errors.push({msg:'username is already exsists'})
                            res.render('signIn',{errors})
                        }
                        else{
                            let userreg = new userbook({
                                username : req.body.username,
                                email : req.body.email,
                                password : req.body.password
                            })
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(userreg.password, salt, (err, hash) => {
                                    if (err) throw err;
                                    userreg.password = hash;
                                    try{
                                        userreg.save()
                                        res.redirect('/login')
                                        }
                                    catch(err){
                                        console.log(err)
                                    }
                                })
                            })
                        }
                    })
                }
            })           
    }
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/books',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next)
})

router.get('/logout',(req,res)=>{
    req.logOut()
    req.flash('success_msg','you are logged out')
    res.redirect('/login')
})

router.get('/books',ensureAuthenticated,(req,res)=>{
    res.render('books')
})

router.get('/create',ensureAuthenticated,(req,res)=>{
    if(books.length>8){
        req.flash('err_msg','Already You have added 8 books')
    }
    else{
        res.render('create')
    }
    
})

router.post('/book',(req,res)=>{
    let book = new books({
        username:req.user.username,
        books:req.body.books
    })
    try{
        res.redirect('/books')
        book.save()
        }
    catch(err){
        console.log(err)
    }
})

router.get('/exsist',(req,res)=>{
    books.find({username:req.user.username}).sort({createdAt : 'desc'})
    .then((result)=>{
        res.render('exsist',{ books : result})
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.get('/:id',ensureAuthenticated,(req,res)=>{
    books.findById(req.params.id)
    .then(result=>{
        res.render('separate',{separate:result})
    })
})

module.exports = router