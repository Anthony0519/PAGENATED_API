const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authorization = async (req, res, next) => {
    try {
        // pass the token the token
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(404).json({
                error: 'Authorization not found'
            });
        }
        // split the token
        const token = auth.split(' ')[1];
        if (!token) {
            return res.status(404).json({
                error: 'Authorization failed: token not found'
            });
        }

        // encrypt the package
        const decodeToken = jwt.verify(token, process.env.jwtKey);

        // find the user
        const user = await userModel.findById(decodeToken.userId);
        if (!user) {
            return res.status(404).json({
                error: 'user not found'
            });
        }

        // check if the user is loged out
        if(user.blackList.includes(token)){
            return res.status(403).json({
                error: 'oops! user logged out. Please login to continue'
            })
        }

        req.user = decodeToken;

        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Session Timeout'
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = authorization;