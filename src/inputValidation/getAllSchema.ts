import * as Joi from "joi"

const getAllSchema = {
  params: Joi.object({
    aid: Joi.string().required().min(1),
  }),
  query: Joi.object({
    limit: Joi.number().valid(5, 10, 25),
    startAtId: Joi.string().min(1),
  }),
}

export default getAllSchema
