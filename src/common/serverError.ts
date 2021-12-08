import CustomError from "./customError"

class ServerError extends CustomError {
  constructor(public errors: any[] = []) {
    super(500, "Something went wrong, please try again later", errors)
  }
}

export default ServerError
