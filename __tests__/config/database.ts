import * as admin from "firebase-admin"
import { Comment, CreateComment } from "../../src/models"

class Database {
  private firestore: admin.firestore.Firestore

  private commentsRef: admin.firestore.CollectionReference

  constructor(firebaseApp: admin.app.App) {
    this.firestore = admin.firestore(firebaseApp)
    this.commentsRef = this.firestore.collection("comments")
  }

  createSingleComment = async (uid: string): Promise<string> => {
    const create: CreateComment = {
      reference: "article-id-1",
      parentId: null,
      text: `this comment was created by ${uid}`,
    }
    const doc = this.commentsRef.doc()
    await doc.set({ ...create, uid })
    return doc.id
  }

  getSingleComment = async (id: string): Promise<Comment | null> => {
    const snapshot = await this.commentsRef.doc(id).get()
    if (!snapshot.exists) {
      return null
    }

    const data = snapshot.data()
    return {
      reference: data.reference,
      uid: data.uid,
      parentId: data.parentId,
      text: data.text,
    }
  }

  deleteAll = async () => {
    const querySnapshot = await this.commentsRef.get()
    const deletions: Promise<admin.firestore.WriteResult>[] = []
    querySnapshot.docs.forEach(snapshot => {
      deletions.push(this.commentsRef.doc(snapshot.id).delete())
    })
    await Promise.all(deletions)
  }
}

export default Database
