const { body, validationResult: result } = require("express-validator");

const RegisterValidator = [
  body("username").notEmpty().withMessage("username is required"),
  body("password").notEmpty().withMessage("password is required"),
  body("email").isEmail().withMessage("email is invalid")
];

const CreateUserValidator = [
  body("username").notEmpty().withMessage("username is required"),
  body("password").notEmpty().withMessage("password is required"),
  body("email").isEmail().withMessage("email is invalid"),
  body("role").notEmpty().withMessage("role is required")
];

const ChangPasswordValidator = [
  body("oldPassword").notEmpty().withMessage("oldPassword is required"),
  body("newPassword").notEmpty().withMessage("newPassword is required")
];

function validationResult(req, res, next) {
  const errors = result(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
}

module.exports = {
  RegisterValidator,
  CreateUserValidator,
  ChangPasswordValidator,
  validationResult
};
