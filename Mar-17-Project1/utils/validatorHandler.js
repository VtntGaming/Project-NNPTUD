let { body, validationResult } = require('express-validator')

let options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }
}

function buildPasswordRule(fieldName) {
    return body(fieldName)
        .notEmpty().withMessage(`${fieldName} khong duoc de trong`)
        .bail()
        .isStrongPassword(options.password)
        .withMessage(`password dai it nhat ${options.password.minLength} ki tu,trong do it nhat ${options.password.minUppercase} chu hoa, ${options.password.minLowercase} chu thuong, ${options.password.minNumbers} so, ${options.password.minSymbols} ki tu`)
}

module.exports = {
    CreateUserValidator: [
        body('email').notEmpty().withMessage("email khong duoc de trong").bail().isEmail().withMessage("email sai dinh dang"),
        body('role').notEmpty().withMessage("role khong duoc de trong").bail().isMongoId().withMessage("role phai la object ID "),
        body('username').notEmpty().withMessage("username khong duoc de trong").bail().isAlphanumeric().withMessage("username chi duoc chua chu va ki tu"),
        buildPasswordRule('password'),
        body('avatarUrl').optional().isURL().withMessage("url sai dinh dang")
    ],
    CreateRoleValidator: [
        body('name').notEmpty().withMessage("name khong duoc de trong")
    ], RegisterValidator: [
        body('email').notEmpty().withMessage("email khong duoc de trong").bail().isEmail().withMessage("email sai dinh dang"),
        body('username').notEmpty().withMessage("username khong duoc de trong").bail().isAlphanumeric().withMessage("username chi duoc chua chu va ki tu"),
        buildPasswordRule('password'),
    ],
    ChangePasswordValidator: [
        body('oldpassword').notEmpty().withMessage('oldpassword khong duoc de trong'),
        buildPasswordRule('newpassword'),
        body('newpassword').custom((value, { req }) => {
            if (value === req.body.oldpassword) {
                throw new Error('newpassword khong duoc trung oldpassword');
            }

            return true;
        })
    ],
    validationResult: function (req, res, next) {
        let result = validationResult(req);
        if (result.errors.length > 0) {
            res.status(404).send(result.errors.map(
                function (e) {
                    return {
                        [e.path]: e.msg
                    }
                }
            ));
        } else {
            next()
        }
    }
}