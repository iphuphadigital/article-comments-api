import * as Joi from "joi"

const updateSingleSchema = {
  headers: Joi.object({
    authorization: Joi.string().required().min(1),
  }),
  params: Joi.object({
    aid: Joi.string().required().min(1),
    id: Joi.string().required().min(1),
  }),
  body: Joi.object({
    text: Joi.string().min(1),
  }).min(1),
}

export default updateSingleSchema
