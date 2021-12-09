// eslint-disable-next-line import/no-extraneous-dependencies
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import CommentService from "../common/commentService"
import CustomError from "../common/customError"
import getInstance from "../common/firebaseAppInstance"
import FirebaseService from "../common/firebaseService"
import ServerError from "../common/serverError"
import UserService from "../common/userService"
import { validateInput } from "../common/validateInput"
import getSingleSchema from "../inputValidation/getSingleSchema"

// eslint-disable-next-line import/prefer-default-export
export const handler: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  context.log("Typescript HTTP trigger function processed a request.")

  try {
    const firebaseApp = getInstance()
    const firebaseService = FirebaseService.getInstance(firebaseApp)
    const commentService = new CommentService(firebaseService.firestore)
    const userService = new UserService(firebaseService.auth)

    // Validate the user's input. Throw a HTTP 422 if input is invalid or malformed
    await validateInput(getSingleSchema, req)

    // Verify the user. Throw a HTTP 401 error if the token is invalid
    const authHeader = req.headers.authorization ?? ""
    const idToken = authHeader.replace("Bearer ", "")
    await userService.getUser(idToken)

    const comment = await commentService.getSingle(req.params.id)

    context.res = {
      status: 200,
      body: {
        comment,
        message: "comment retrieved successfully",
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
