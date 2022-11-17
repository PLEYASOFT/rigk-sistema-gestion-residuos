import Joi from 'joi';

const loginScheme = Joi.object({
    user: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }).required(),
    password: Joi.string()
              .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});
export default loginScheme;