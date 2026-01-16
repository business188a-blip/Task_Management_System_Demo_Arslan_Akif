// backend/validators/taskValidator.js
import Joi from "joi";

export const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  status: Joi.string().valid("Pending", "In Progress", "Completed"),
  dueDate: Joi.date(),
});
