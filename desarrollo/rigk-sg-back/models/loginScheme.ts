import Joi from 'joi';

export const loginScheme = Joi.object({
    user: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }).required(),
    password: Joi.string()
              .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});
export const modifyPasswordScheme = Joi.object({
    newPassword: Joi.string().min(4),
    actual: Joi.string().min(4),
    repeatPassword: Joi.string().min(4)
})