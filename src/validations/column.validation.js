import Joi from "joi";

const columnSchema = Joi.object({
  title: Joi.string().min(2).max(20).required(),
  order_num: Joi.number().positive().min(0).max(100).required(),
});

const columnSchemaUpdate = Joi.object({
  title: Joi.string().min(2).max(20),
  order_num: Joi.number().positive().min(0).max(100),
});

export { columnSchema, columnSchemaUpdate };