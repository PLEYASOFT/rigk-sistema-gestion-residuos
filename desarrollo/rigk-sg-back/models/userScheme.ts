import Joi from "joi";

export const userScheme = Joi.object({
    ID: Joi.number().allow(null),
    FIRST_NAME: Joi.string(),
    LAST_NAME: Joi.string(),
    EMAIL: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }).required(),
    ROL: Joi.number().required(),
    PASSWORD: Joi.string().allow(null),
    PHONE: Joi.number(),
    PHONE_OFFICE: Joi.number(),
    POSITION: Joi.string(),
    BUSINESS: Joi.array()
});