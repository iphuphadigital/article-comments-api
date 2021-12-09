import * as admin from "firebase-admin"
import CustomError from "./customError"

class UserService {
  private auth: admin.auth.Auth

  constructor(auth: admin.auth.Auth) {
    this.auth = auth
  }

  async getUser(idToken: string): Promise<admin.auth.UserRecord> {
    try {
      const token = await this.auth.verifyIdToken(idToken)
      return this.auth.getUser(token.uid)
    } catch (error) {
      throw new CustomError(401, "unauthorized user", [error])
    }
  }
}

export default UserService
