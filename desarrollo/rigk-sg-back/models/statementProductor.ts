import Joi from 'joi';

export const statementProductorFormScheme = Joi.object({
    header: Joi.object({
        id_business: Joi.number()
            .required(),
        year_statement: Joi.number()
            .min(1000)
            .max(9999)
            .required(),
        state: Joi.boolean(),
        id_statement: Joi.number().allow(null)
    }),
    detail: Joi.array().has(Joi.object({
        precedence: Joi.number()
            .required(),
        hazard: Joi.number()
            .required(),
        recyclability: Joi.number()
            .required(),
        type_residue: Joi.number()
            .required(),
        value: Joi.number()
            .required(),
        amount: Joi.number().required(),
        id: Joi.number().allow(null),
        id_header: Joi.number().allow(null)
    })),

});

export const statementByIdScheme = Joi.object({
    business: Joi.number()
        .required(),
    draft: Joi.number().required(),
    year: Joi.number()
        .min(1000)
        .max(9999)
        .required()
});
export const updateStateScheme = Joi.object({
    id: Joi.number()
        .required(),
    state: Joi.boolean()
        .required()
});