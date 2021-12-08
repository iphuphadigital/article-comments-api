class CustomError extends Error {
  statusCode: number

  errors: any[]

  constructor(statusCode: number, message: string, errors: any[] = []) {
    super()
    this.statusCode = statusCode
    this.errors = errors
    this.message = message
  }
}

export default CustomError
