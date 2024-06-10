import Joi from 'joi';
export const getScheme = Joi.object({
    invoice_number: Joi.any(),
    treatment_type: Joi.number().required(),
    material_type: Joi.number().required(),
    idGestor: Joi.number().required(),
});
export const saveScheme = Joi.object({
    invoice_number: Joi.number().required(),
    vat: Joi.string().required(),
    id_detail: Joi.number().required(),
    date_pr: Joi.date().required(),
    value: Joi.string(),
    valued_total: Joi.string(),
    treatment: Joi.number().required(),
    id_material: Joi.number().required(),
    IdGestor: Joi.number().required(),
    id_business: Joi.string().required()
});