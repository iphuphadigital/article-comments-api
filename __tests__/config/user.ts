import { initializeApp } from "firebase/app"
import {
  Auth,
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  IdTokenResult,
} from "firebase/auth"

class User {
  private auth: Auth

  private createdUsers: Map<
    string,
    {
      email: string
      password: string
    }
  > = new Map()

  private numOfUsers = 0

  constructor() {
    const firebaseConfig = {
      apiKey: "apikey",
      projectId: process.env.GCLOUD_PROJECT,
    }

    const app = initializeApp(firebaseConfig)
    this.auth = getAuth(app)
    connectAuthEmulator(
      this.auth,
      `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`
    )
  }

  create = async () => {
    const user = await this.createRandomUser()
    return user.user?.uid ?? ""
  }

  private createRandomUser = async () => {
    const email = `test_user_${this.numOfUsers}@email.com`
    const password = `test_user_${this.numOfUsers}_password`
    const user = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    )
    if (user.user) {
      const { uid } = user.user
      this.createdUsers.set(uid, { email, password })
      this.numOfUsers = this.createdUsers.size
    }

    return user
  }

  delete = async (uid: string) => {
    const createdUser = this.createdUsers.get(uid)

    if (createdUser == null) {
      // Probably already deleted
      return
    }

    const { currentUser } = this.auth
    if (currentUser && currentUser.uid === uid) {
      await currentUser.delete()
    } else {
      const user = await signInWithEmailAndPassword(
        this.auth,
        createdUser.email,
        createdUser.password
      )
      await user.user?.delete()
    }
    this.createdUsers.delete(uid)
  }

  deleteAll = async () => {
    const promises: Promise<any>[] = []

    this.createdUsers.forEach((_, key) => {
      promises.push(this.delete(key))
    })

    // Run all delete invocations simultaneously
    await Promise.all(promises)
  }

  getToken = async (uid: string) => {
    const result = await this.getResult(uid)
    return result?.token
  }

  private getResult = async (
    uid: string
  ): Promise<IdTokenResult | undefined> => {
    const createdUser = this.createdUsers.get(uid)

    if (createdUser == null) {
      // Probably already deleted
      return
    }

    let result: IdTokenResult | undefined
    const { currentUser } = this.auth
    if (currentUser && currentUser.uid === uid) {
      result = await currentUser.getIdTokenResult(true)
    } else {
      const user = await signInWithEmailAndPassword(
        this.auth,
        createdUser.email,
        createdUser.password
      )
      result = await user.user?.getIdTokenResult(true)
    }

    return result
  }
}

export default User
