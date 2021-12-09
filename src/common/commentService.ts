import * as admin from "firebase-admin"
import { Comment, CreateComment, UpdateComment } from "../models"
import CustomError from "./customError"

class CommentService {
  private store: admin.firestore.Firestore

  private commentsRef: admin.firestore.CollectionReference

  constructor(store: admin.firestore.Firestore) {
    this.store = store
    this.commentsRef = this.store.collection("comments")
  }

  getAllByReference = async (
    reference: string,
    limit: number = 5,
    page: number = 1
  ) => {
    console.log(limit)
    console.log(page)
    const col = await this.commentsRef
      .limit(limit)
      .offset((page - 1) * limit)
      .where("reference", "==", reference)
      .get()
    return col.docs
      .filter(doc => doc.exists)
      .map(doc => this.mapSnapshotToComment(doc))
  }

  getSingle = async (id: string): Promise<Comment | null> => {
    const snapshot = await this.commentsRef.doc(id).get()
    if (!snapshot.exists) throw new CustomError(404, "comment not found")
    return this.mapSnapshotToComment(snapshot)
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

  // eslint-disable-next-line class-methods-use-this
  private mapSnapshotToComment = (
    snapshot: admin.firestore.DocumentSnapshot
  ): Comment | null => {
    if (snapshot.exists) {
      const data = snapshot.data()
      return {
        reference: data.reference,
        parentId: data.parentId,
        text: data.text,
        uid: data.uid,
      }
    }
    return null
  }
}

export default CommentService
