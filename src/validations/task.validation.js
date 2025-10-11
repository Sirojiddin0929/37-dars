import Joi from "joi";

const taskSchema = Joi.object({
    title: Joi.string().min(2).max(20).required(),
    description: Joi.string().min(2).max(100).required(),
    order_num: Joi.number().positive().min(0).max(100).required(),
});

const taskSchemaUpdate = Joi.object({
    title: Joi.string().min(2).max(20),
    description: Joi.string().min(2).max(100),
    order_num: Joi.number().positive().min(0).max(100),
});

export { taskSchema, taskSchemaUpdate };