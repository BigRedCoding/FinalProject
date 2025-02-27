const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const urlCheck = (value, helpers) => {
  if (value === null || value === undefined) {
    return "";
  }
  if (value === "") {
    return value;
  }

  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.email");
};

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The "name" must be at least 2 characters long',
      "string.max": 'The "name" must be no longer than 30 characters',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(urlCheck).allow("").required().messages({
      "string.uri": 'The "avatar" field must be a valid URL',
    }),

    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The "name" must be at least 2 characters long',
      "string.max": 'The "name" must be no longer than 30 characters',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().allow("").required().custom(urlCheck).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
  }),
});

module.exports = {
  validateUserInfo,
  validateAuthentication,
  validateUpdateUserInfo,
};
