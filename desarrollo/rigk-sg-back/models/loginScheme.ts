import Joi from 'joi';

<<<<<<< HEAD
export const loginScheme = Joi.object({
    user: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
=======
const loginScheme = Joi.object({
    user: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }).required(),
>>>>>>> develop
    password: Joi.string()
              .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});
export const modifyPasswordScheme = Joi.object({
    newPassword: Joi.string().min(4),
    actual: Joi.string().min(4),
    repeatPassword: Joi.string().min(4)
})