import * as admin from "firebase-admin"
import { Comment, CreateComment } from "../../src/models"

class TestDatabase {
  private firestore: admin.firestore.Firestore

  private articlesRef: admin.firestore.CollectionReference

  private commentsPath = "comments"

  constructor(firestore: admin.firestore.Firestore) {
    this.firestore = firestore
    this.articlesRef = this.firestore.collection("articles")
  }

  createSingleComment = async (aid: string, uid: string): Promise<string> => {
    const doc = this.articlesRef.doc(aid).collection(this.commentsPath).doc()
    const create: CreateComment = {
      articleId: aid,
      parentId: null,
      text: `this comment (id: ${doc.id}) was created by ${uid}`,
    }
    await doc.set({ ...create, uid })
    return doc.id
  }

  createMultipleComments = async (
    aid: string,
    uid: string,
    count: number
  ): Promise<string[]> => {
    const comments = []
    for (let index = 0; index < count; index += 1) {
      comments.push(this.createSingleComment(aid, uid))
    }
    return Promise.all(comments)
  }

  getSingleComment = async (
    aid: string,
    id: string
  ): Promise<Comment | null> => {
    const doc = this.articlesRef.doc(aid).collection(this.commentsPath).doc(id)
    const snapshot = await doc.get()
    if (!snapshot.exists) {
      return null
    }

    const data = snapshot.data()
    return {
      articleId: data.articleId,
      uid: data.uid,
      parentId: data.parentId,
      text: data.text,
    }
  }

  deleteAll = async () => {
    const snapshot = await this.articlesRef.get()
    await this.queryDeletion(snapshot)
  }

  private queryDeletion = async (
    querySnapshot: admin.firestore.QuerySnapshot
  ) => {
    const deletions: Promise<admin.firestore.WriteResult>[] = []
    querySnapshot.docs.forEach(async snapshot => {
      const cSnapshot = await this.articlesRef
        .doc(snapshot.id)
        .collection(this.commentsPath)
        .get()
      await this.queryDeletion(cSnapshot)
      deletions.push(this.articlesRef.doc(snapshot.id).delete())
    })
    await Promise.all(deletions)
  }
}

export default TestDatabase
