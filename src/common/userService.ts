import * as admin from "firebase-admin"
import CustomError from "./customError"

class UserService {
  private firebaseApp: admin.app.App

  private auth: admin.auth.Auth

  constructor(firebaseApp: admin.app.App) {
    this.firebaseApp = firebaseApp
    this.auth = admin.auth(this.firebaseApp)
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
