// eslint-disable-next-line import/no-unresolved
import { App } from "firebase-admin/app"
// eslint-disable-next-line import/no-unresolved
import { Auth, getAuth, UserRecord } from "firebase-admin/auth"
import CustomError from "./customError"

class UserService {
  private firebaseApp: App

  private auth: Auth

  constructor(firebaseApp: App) {
    this.firebaseApp = firebaseApp
    this.auth = getAuth(this.firebaseApp)
  }

  async getUser(idToken: string): Promise<UserRecord> {
    try {
      const token = await this.auth.verifyIdToken(idToken)
      return this.auth.getUser(token.uid)
    } catch (error) {
      throw new CustomError(401, "unauthorized user", [error])
    }
  }
}

export default UserService
