import * as admin from "firebase-admin"
import { CreateComment, UpdateComment } from "../models"

class CommentService {
  private store: admin.firestore.Firestore

  private commentsRef: admin.firestore.CollectionReference

  constructor(store: admin.firestore.Firestore) {
    this.store = store
    this.commentsRef = this.store.collection("comments")
  }

  getAllByReference = async (
    reference: string,
    limit: number,
    page: number
  ) => {
    const col = await this.commentsRef
      .limit(limit)
      .offset(page * limit)
      .where("reference", "==", reference)
      .get()
    return col.docs.map(doc => doc.data())
  }

  createSingle = async (
    uid: string,
    create: CreateComment
  ): Promise<string> => {
    const doc = this.commentsRef.doc()
    await doc.set({ ...create, uid })
    return doc.id
  }

  updateSingle = async (id: string, update: UpdateComment): Promise<void> => {
    const doc = this.commentsRef.doc(id)
    await doc.update({ ...update })
  }

  deleteSingle = async (id: string): Promise<void> => {
    const doc = this.commentsRef.doc(id)
    await doc.delete()
  }
}

export default CommentService
