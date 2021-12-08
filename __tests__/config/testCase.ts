export interface TestCase<T> {
  user: {
    uid: string
  }
  request: {
    body?: T
    headers: {
      [name: string]: string | undefined
    }
  }
  expected: {
    statusCode: number
    message: string
    success: boolean
  }
}
