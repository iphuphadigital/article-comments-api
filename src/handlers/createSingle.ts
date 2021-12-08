// eslint-disable-next-line import/no-extraneous-dependencies
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import CommentService from "../common/commentService"
import CustomError from "../common/customError"
import getInstance from "../common/firebaseAppInstance"
import ServerError from "../common/serverError"
import UserService from "../common/userService"
import { validateInput } from "../common/validateInput"
import createSingleSchema from "../inputValidation/createSingleSchema"

// eslint-disable-next-line import/prefer-default-export
export const handler: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  context.log("Typescript HTTP trigger function processed a request.")

  try {
    const firebaseApp = getInstance()
    const commentService = new CommentService(firebaseApp)
    const userService = new UserService(firebaseApp)

    // Validate the user's input. Throw a HTTP 422 if input is invalid or malformed
    await validateInput(createSingleSchema, req)

    // Verify the user. Throw a HTTP 401 error if the token is invalid
    const authHeader = req.headers.authorization ?? ""
    const idToken = authHeader.replace("Bearer ", "")
    const user = await userService.getUser(idToken)

    const id = await commentService.createSingle(user.uid, {
      reference: req.body.reference,
      parentId: req.body.parentId,
      text: req.body.text,
    })

    context.res = {
      status: 201,
      body: {
        id,
        message: "comment created successfully",
      },
    }
  } catch (error) {
    if (error instanceof CustomError) {
      context.res = {
        status: error.statusCode,
        body: {
          message: error.message,
          errors: error.errors,
        },
      }
    } else {
      const serverError = new ServerError([error])
      context.res = {
        status: serverError.statusCode,
        body: {
          message: serverError.message,
          errors: serverError.errors,
        },
      }
    }
  }
}
