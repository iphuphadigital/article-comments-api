import * as Joi from "joi"

const getAllByReferenceSchema = {
  params: Joi.object({
    aid: Joi.string().required().min(1),
  }),
  query: Joi.object({
    limit: Joi.number().valid(5, 10, 20),
    page: Joi.number().min(1),
  }),
}

export default getAllByReferenceSchema
