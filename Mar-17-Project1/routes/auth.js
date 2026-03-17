var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, ChangePasswordValidator, validationResult } = require('../utils/validatorHandler')
let { CheckLogin } = require('../utils/authHandler')
let { JWT_COOKIE_NAME, jwtCookieOptions, createAccessToken } = require('../utils/jwtHandler')

router.post('/register', RegisterValidator, validationResult, async function (req, res, next) {
    try {
        let newItem = await userController.CreateAnUser(
            req.body.username, req.body.password, req.body.email,
            "69af870aaa71c433fa8dda8e"
        )
        res.send(newItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
})
router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let result = await userController.FindUserByUsername(username);
        if (!result) {
            res.status(403).send("sai thong tin dang nhap");
            return;
        }
        if (result.lockTime > Date.now()) {
            res.status(404).send("ban dang bi ban");
            return;
        }
        result = await userController.CompareLogin(result, password);
        if (!result) {
            res.status(403).send("sai thong tin dang nhap");
            return;
        }

        let token = createAccessToken(result);

        res.cookie(JWT_COOKIE_NAME, token, jwtCookieOptions)
        res.send({
            userId: result._id,
            token: token
        })

    } catch (err) {
        res.status(400).send({ message: err.message });
    }
})
router.get('/me', CheckLogin, function (req, res, next) {
    let user = req.user;
    res.send(user)
})
router.post('/logout', CheckLogin, function (req, res, next) {
    res.cookie(JWT_COOKIE_NAME, "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    })
    res.send("da logout")
})

router.post('/change-password', CheckLogin, ChangePasswordValidator, validationResult, async function (req, res, next) {
    try {
        let { oldpassword, newpassword } = req.body;

        if (!userController.ComparePassword(req.user, oldpassword)) {
            res.status(403).send({ message: 'oldpassword khong dung' });
            return;
        }

        await userController.ChangePassword(req.user, newpassword);

        let token = createAccessToken(req.user);
        res.cookie(JWT_COOKIE_NAME, token, jwtCookieOptions);
        res.send({
            message: 'doi mat khau thanh cong',
            token: token
        });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
})

module.exports = router;