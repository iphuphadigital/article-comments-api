import * as admin from "firebase-admin"

class FirebaseService {
  // eslint-disable-next-line no-use-before-define
  private static instance: FirebaseService

  auth: admin.auth.Auth

  firestore: admin.firestore.Firestore

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(firebaseApp: admin.app.App) {
    this.auth = admin.auth(firebaseApp)
    this.firestore = admin.firestore(firebaseApp)
    this.firestore.settings({ ignoreUndefinedProperties: true })
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(firebaseApp: admin.app.App): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService(firebaseApp)
    }

    return FirebaseService.instance
  }
}

export default FirebaseService
