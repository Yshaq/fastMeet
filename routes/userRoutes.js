const passport = require("passport"); // require passport for authentication and authorization
const express = require("express");
const { Router } = require("express");
var bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user.model.js')



require("../config/local");

router.post('/signin',
    passport.authenticate('LocalStrategy', {
        successRedirect: 'http://localhost:3001/',
        failureRedirect: 'http://localhost:3001/login',
        failureFlash: true
    })
);

router.post('/register', async (req, res) => {
    console.log(req.body)
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            source: "manual",
        })
        res.json({ status: 'ok' })
        // res.redirect('http://localhost:3001/login/');
    } catch (err) {
        console.log(err)
        res.json({ status: 'error', error: 'Duplicate email' })
    }
})


module.exports = router;