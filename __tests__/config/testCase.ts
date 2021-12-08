export interface TestCase<T, P = any> {
  user: {
    uid: string
  }
  request: {
    body?: T
    params?: P
    headers: {
      [name: string]: string | undefined
    }
  }
  expected: {
    statusCode: number
    message: string
  }
}
