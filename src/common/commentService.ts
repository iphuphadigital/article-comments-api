import { app, firestore } from "firebase-admin"
import { CreateComment } from "../models"

class CommentService {
  private firebaseApp: app.App

  private firestore: firestore.Firestore

  private commentsRef: firestore.CollectionReference

  constructor(firebaseApp: app.App) {
    this.firebaseApp = firebaseApp
    this.firestore = firestore(this.firebaseApp)
    this.commentsRef = this.firestore.collection("comments")
  }

  createSingle = async (create: CreateComment) => {
    await this.commentsRef.doc(create.reference).set(create)
    return create.reference
  }
}

export default CommentService
