import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),

  RSA_PRIVATE_KEY: Joi.string()
    .required()
    .pattern(/BEGIN (RSA )?PRIVATE KEY/)
    .message('RSA_PRIVATE_KEY must be a valid PEM private key'),

  RSA_PUBLIC_KEY: Joi.string()
    .required()
    .pattern(/BEGIN (RSA )?PUBLIC KEY/)
    .message('RSA_PUBLIC_KEY must be a valid PEM public key'),
});