import { celebrate, Joi, Segments } from 'celebrate';

export const imageJoiSchema = Joi.object({
  fileName: Joi.string().required(),
  originalName: Joi.string().required(),
});

export const createProductSchema = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  image: imageJoiSchema.required(),
  category: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).allow(null),
});

export const validateCreateProduct = celebrate({
  [Segments.BODY]: createProductSchema,
});

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.string()
        .hex()
        .required(),
    )
    .min(1)
    .required(),
  total: Joi.number()
    .positive()
    .required(),
  payment: Joi.string()
    .valid('card', 'online')
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  phone: Joi.string()
    .required(),
  address: Joi.string()
    .required(),
});

export const validateCreateOrder = celebrate({
  [Segments.BODY]: createOrderSchema,
});
