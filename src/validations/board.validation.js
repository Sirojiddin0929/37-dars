import Joi from "joi";

const boardSchema = Joi.object({
  title: Joi.string().min(2).max(20).required(),
});

const boardSchemaUpdate = Joi.object({
  title: Joi.string().min(2).max(20),
});

export { boardSchema, boardSchemaUpdate };