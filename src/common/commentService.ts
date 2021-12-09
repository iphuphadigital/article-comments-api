import * as admin from "firebase-admin"
import { Comment, CreateComment, UpdateComment } from "../models"
import CustomError from "./customError"

class CommentService {
  private store: admin.firestore.Firestore

  private articlesRef: admin.firestore.CollectionReference

  private commentsPath: string = "comments"

  constructor(store: admin.firestore.Firestore) {
    this.store = store
    this.articlesRef = this.store.collection("articles")
  }

  getAllByReference = async (
    aid: string,
    limit: number = 5,
    page: number = 1
  ) => {
    console.log(limit)
    console.log(page)
    const col = await this.articlesRef
      .doc(aid)
      .collection(this.commentsPath)
      .limit(limit)
      .offset((page - 1) * limit)
      .get()
    return col.docs
      .filter(doc => doc.exists)
      .map(doc => this.mapSnapshotToComment(doc))
  }

  getSingle = async (aid: string, id: string): Promise<Comment | null> => {
    const doc = this.articlesRef.doc(aid).collection(this.commentsPath).doc(id)
    const snapshot = await doc.get()
    if (!snapshot.exists) throw new CustomError(404, "comment not found")
    return this.mapSnapshotToComment(snapshot)
  }

  createSingle = async (
    aid: string,
    uid: string,
    create: CreateComment
  ): Promise<string> => {
    const doc = this.articlesRef.doc(aid).collection(this.commentsPath).doc()
    await doc.set({ ...create, uid })
    return doc.id
  }

  updateSingle = async (
    aid: string,
    id: string,
    update: UpdateComment
  ): Promise<void> => {
    const doc = this.articlesRef.doc(aid).collection(this.commentsPath).doc(id)
    await doc.update({ ...update })
  }

  deleteSingle = async (aid: string, id: string): Promise<void> => {
    const doc = this.articlesRef.doc(aid).collection(this.commentsPath).doc(id)
    await doc.delete()
  }

  // eslint-disable-next-line class-methods-use-this
  private mapSnapshotToComment = (
    snapshot: admin.firestore.DocumentSnapshot
  ): Comment | null => {
    if (snapshot.exists) {
      const data = snapshot.data()
      return {
        articleId: data.articleId,
        parentId: data.parentId,
        text: data.text,
        uid: data.uid,
      }
    }
    return null
  }
}

export default CommentService
