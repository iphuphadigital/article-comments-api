// eslint-disable-next-line import/no-extraneous-dependencies
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import CommentService from "../common/commentService"
import CustomError from "../common/customError"
import getInstance from "../common/firebaseAppInstance"
import FirebaseService from "../common/firebaseService"
import ServerError from "../common/serverError"
import { validateInput } from "../common/validateInput"
import getAllByReferenceSchema from "../inputValidation/getAllByReferenceSchema"

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

    // Validate the user's input. Throw a HTTP 422 if input is invalid or malformed
    await validateInput(getAllByReferenceSchema, req)

    const comments = await commentService.getAllByReference(
      req.params.aid,
      req.query?.limit && parseInt(req.query.limit, 10),
      req.query?.page && parseInt(req.query.page, 10)
    )

    context.res = {
      status: 200,
      body: {
        comments,
        message: "all comments retrieved successfully",
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
