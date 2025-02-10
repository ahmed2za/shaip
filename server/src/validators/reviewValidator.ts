import Joi from 'joi';

export const validateReview = (data: any) => {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    text: Joi.string().min(10).max(1000).required(),
    companyId: Joi.string().required(),
    language: Joi.string().required(),
    purchaseVerified: Joi.boolean(),
  });

  return schema.validate(data);
};

export const validateReply = (data: any) => {
  const schema = Joi.object({
    text: Joi.string().min(10).max(1000).required(),
  });

  return schema.validate(data);
};
