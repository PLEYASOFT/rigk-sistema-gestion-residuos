import Joi from 'joi';

const loginScheme = Joi.object({
    login: Joi.object({
        user:    Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    }),
});

console.log(loginScheme.validate({ user: 'sdasdasd@gmail.com', password: "" }));
export default loginScheme;