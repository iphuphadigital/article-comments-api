import * as admin from "firebase-admin"
import { Comment } from "../../src/models"

class Database {
  private firestore: admin.firestore.Firestore

  constructor(firebaseApp: admin.app.App) {
    this.firestore = admin.firestore(firebaseApp)
  }

  getSingleComment = async (id: string): Promise<Comment> => {
    const snapshot = await this.firestore.collection("comments").doc(id).get()
    const data = snapshot.data()
    return {
      reference: data.reference,
      uid: data.uid,
      parentId: data.parentId,
      text: data.text,
    }
  }

  deleteAll = async () => {
    const querySnapshot = await this.firestore.collection("comments").get()
    const deletions: Promise<admin.firestore.WriteResult>[] = []
    querySnapshot.docs.forEach(snapshot => {
      deletions.push(
        this.firestore.collection("comments").doc(snapshot.id).delete()
      )
    })
    await Promise.all(deletions)
  }
}

export default Database
