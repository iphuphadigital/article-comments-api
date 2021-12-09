import * as Joi from "joi"

const getSingleSchema = {
  headers: Joi.object({
    authorization: Joi.string().required().min(1),
  }),
  params: Joi.object({
    id: Joi.string().required().min(1),
  }),
}

export default getSingleSchema
