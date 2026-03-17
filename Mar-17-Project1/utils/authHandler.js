let userController = require('../controllers/users')
let { JWT_COOKIE_NAME, verifyAccessToken } = require('./jwtHandler')

function extractToken(req) {
    let token = req.headers.authorization;
    let cookies = req.cookies || {};

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }

    if (!token && cookies[JWT_COOKIE_NAME]) {
        token = cookies[JWT_COOKIE_NAME];
    }

    return token;
}

module.exports = {
    CheckLogin: async function (req, res, next) {
        let token = extractToken(req);
        if (!token) {
            res.status(401).send("ban chua dang nhap")
            return;
        }

        let payload;
        try {
            payload = verifyAccessToken(token);
        } catch (error) {
            res.status(401).send("token khong hop le")
            return;
        }

        let user = await userController.GetUserById(payload.sub);
        if (!user) {
            res.status(401).send("ban chua dang nhap")
            return;
        }

        req.user = user;
        req.tokenPayload = payload;
        next();
    }
}