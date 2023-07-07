import Joi from 'joi';
export const loginScheme = Joi.object({
    user: Joi.string().required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
});
export const modifyPasswordScheme = Joi.object({
    newPassword: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
    actual: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
    repeatPassword: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
});
export const recoveryPasswordScheme = Joi.object({
    user: Joi.string().required(),
    password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
    repeatPassword: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
});

