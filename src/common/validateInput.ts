// eslint-disable-next-line import/no-extraneous-dependencies
import { HttpRequest } from "@azure/functions"
import CustomError from "./customError"

const schemaKeys = ["headers", "params", "query", "body"]

export type RequestSchema = {
  headers?: any
  params?: any
  query?: any
  body?: any
}

const options = {
  allowUnknown: true,
  abortEarly: false,
}

export const validateInput = async (
  reqSchema: RequestSchema,
  req: HttpRequest
) => {
  // allow to specify allowUnknown
  // options.allowUnknown = reqSchema.allowUnknowns === false ? false : true;
  // console.log(`errors:  ${errors}`)

  const validations = schemaKeys.map(key => {
    const schema = reqSchema[key]
    const value = req[key]

    if (schema) {
      const result = schema.validate(value, options)
      return Promise.resolve({ [key]: result })
    }
    return Promise.resolve({})
  })
  const validatedSchemas = await Promise.all(validations)
  const errors = []
  // Check all validations for any Joi errors.
  validatedSchemas.forEach(validatedSchema => {
    schemaKeys.forEach(schemaKey => {
      if (validatedSchema[schemaKey] && validatedSchema[schemaKey].error) {
        const messages = validatedSchema[schemaKey].error.details.map(
          (detail: any) => `${detail.message} in ${schemaKey}`
        )

        errors.push(...messages)
      }
    })
  })

  if (errors.length > 0)
    throw new CustomError(422, "Invalid input supplied", errors)
}
