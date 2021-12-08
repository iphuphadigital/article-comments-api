import * as admin from "firebase-admin"
import { CreateComment } from "../models"

class CommentService {
  private firebaseApp: admin.app.App

  private firestore: admin.firestore.Firestore

  private commentsRef: admin.firestore.CollectionReference

  constructor(firebaseApp: admin.app.App) {
    this.firebaseApp = firebaseApp
    this.firestore = admin.firestore(this.firebaseApp)
    this.commentsRef = this.firestore.collection("comments")
  }

  createSingle = async (uid: string, create: CreateComment) => {
    const doc = this.commentsRef.doc()
    await doc.set({ ...create, uid })
    return doc.id
  }
}

export default CommentService
