const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');

exports.handleSignup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const newUser = new User({ email: req.body.email, password: hash})
            return newUser.save()
        })
        .then( user => {
            res.status(201).json({ message: 'User created successfully', user: user })
        })
        .catch( err => {
            res.status(409).json({ message: 'Credentials wrong' })
        })

}

exports.handleLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then( user => {

            if(!user){
                return res.status(404).json({ message: 'Email not found!' })
            }
            
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then( isValid => {

            if(!isValid) {
                return res.status(401).json({ message: 'Wrong password' })
            }

            const token = jwt.sign( { email: fetchedUser.email, userId: fetchedUser._id }, 
                process.env.JWT_SECURE_KEY, 
                { expiresIn: '1h' } 
            );

            res.status(200).json({ 
                message: 'Authentication success', 
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
        })
        .catch( err => {
            res.status(401).json({message: 'Authentication failed'})
        })
}