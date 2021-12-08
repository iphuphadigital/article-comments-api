// eslint-disable-next-line import/no-unresolved
import { App } from "firebase-admin/app"
import {
  Firestore,
  getFirestore,
  CollectionReference,
  // eslint-disable-next-line import/no-unresolved
} from "firebase-admin/firestore"
import { CreateComment } from "../models"

class CommentService {
  private firebaseApp: App

  private firestore: Firestore

  private commentsRef: CollectionReference

  constructor(firebaseApp: App) {
    this.firebaseApp = firebaseApp
    this.firestore = getFirestore(this.firebaseApp)
    this.commentsRef = this.firestore.collection("comments")
  }

  createSingle = async (create: CreateComment) => {
    await this.commentsRef.doc(create.reference).set(create)
    return create.reference
  }
}

export default CommentService
