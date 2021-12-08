import * as Joi from "joi"

const createSingleSchema = {
  headers: Joi.object({
    authorization: Joi.string().required().min(1),
  }),
  body: Joi.object({
    reference: Joi.string().required().min(1),
    parentId: Joi.string().required().min(1).allow(null),
    text: Joi.string().required().min(1),
  }),
}

export default createSingleSchema
