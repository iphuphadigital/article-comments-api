export interface TestCase<T, P = any, Q = any> {
  user: {
    uid: string
  }
  request: {
    body?: T
    params?: P
    query?: Q
    headers: {
      [name: string]: string | undefined
    }
  }
  expected: {
    statusCode: number
    message: string
  }
}
