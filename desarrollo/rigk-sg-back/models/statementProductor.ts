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
        created_by: Joi.string()
                    .required()
    }),
    detail: Joi.object({
        precedence: Joi.number()
                    .required(),
        hazard: Joi.number()
                    .required(),
        recyclability: Joi.number()
                        .required(),
        type_residye: Joi.number()
                        .required(),
        value: Joi.number()
                        .required()
    }),
});

export const statementByIdScheme = Joi.object({
    business: Joi.number()
            .required(),
    year: Joi.number()
        .required()
});
export const updateStateScheme = Joi.object({
    id: Joi.number()
            .required(),
    state: Joi.boolean()
        .required()
});