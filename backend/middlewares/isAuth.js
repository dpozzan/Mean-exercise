const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // beacause "Bearer " + "Json Web Token"
        const decodedToken = jwt.verify(token, 'secret-word-should-be-longer-longer-longer-to-be-more-secure-secure-secure');
        // It allows to set the userId and reach it during the next middlewares.
        req.userData = { email: decodedToken.email, userId: decodedToken.userId};
        next()
        
    } catch (err) {
        res.status(401).json({ message: 'Authentication failed' })
    }
}