import { app, auth } from "firebase-admin"
import CustomError from "./customError"

class UserService {
  private firebaseApp: app.App

  private auth: auth.Auth

  constructor(firebaseApp: app.App) {
    this.firebaseApp = firebaseApp
    this.auth = auth(this.firebaseApp)
  }

  async getUser(idToken: string): Promise<auth.UserRecord> {
    try {
      const token = await this.auth.verifyIdToken(idToken)
      return this.auth.getUser(token.uid)
    } catch (error) {
      throw new CustomError(401, "unauthorized user", [error])
    }
  }
}

export default UserService
