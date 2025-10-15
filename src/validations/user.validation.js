import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(4).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")).required()
});

const userSchemaUpdate = Joi.object({
  name: Joi.string().min(4).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(20).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
});

const updatePasswordScheme=Joi.object({
  currentPassword:Joi.string().min(8).max(20).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")).required(),
  newPassword:Joi.string().min(8).max(20).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")).required(),
  confirmPassword:Joi.any().equal(Joi.ref("newPassword")).required()
})
export { userSchema, userSchemaUpdate,updatePasswordScheme };