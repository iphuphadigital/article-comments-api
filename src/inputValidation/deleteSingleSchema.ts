import * as Joi from "joi"

const deleteSingleSchema = {
  headers: Joi.object({
    authorization: Joi.string().required().min(1),
  }),
  params: Joi.object({
    aid: Joi.string().required().min(1),
    id: Joi.string().required().min(1),
  }),
}

export default deleteSingleSchema
