import Joi from 'joi';
export const getScheme = Joi.object({
    invoice_number: Joi.number().required(),
    vat:Joi.string().required(),
    treatment_type:Joi.number().required(),
    material_type: Joi.number().required()
});
export const saveScheme = Joi.object({
    invoice_number: Joi.number().required(),
    vat:Joi.string().required(),
    id_detail: Joi.number().required(),
    date_pr: Joi.date().required(),
    value: Joi.number(),
    valued_total: Joi.number(),
    treatment:Joi.number().required(),
    id_material: Joi.number().required()
});