import { Context } from "@azure/functions"
import { handler as getAllArticleComments } from "../../src/handlers/getAllArticleComments"
import { getGlobalDb, getGlobalUser } from "../config/setup"
import { TestCase } from "../config/testCase"

type ParamType = { aid: string }
type QueryType = { limit?: number; page?: number }

describe("handlers.getAllArticleComments", () => {
  let context: Context
  let uid1: string
  let uid2: string
  let token1: string
  let token2: string
  let commentsIds1: string[]
  let commentsIds2: string[]
  const articleId = "article-id-1"

  const runTestCase = async (tc: TestCase<null, ParamType, QueryType>) => {
    // Make the request
    await getAllArticleComments(context, tc.request)

    if (context.res?.status === 500) {
      // eslint-disable-next-line no-console
      console.log(`runTestCase 500 error: ${JSON.stringify(context.res?.body)}`)
    }

    // Run test validations
    expect(context.res?.status).toBe(tc.expected.statusCode)
    expect(context.res?.body.message).toBe(tc.expected.message)

    if (context.res?.status === 200) {
      const comments = context.res?.body.comments
      console.log(comments)
      expect(comments).toBeTruthy()
      expect(comments.length).toBeLessThanOrEqual(tc.request.query?.limit ?? 5)
      // We should also check if the database truly returned the correct
      // documents and their data
      // const db = getGlobalDb()
      // const savedComment = await db.getSingleComment(tc.request.params?.id)
      // expect(savedComment.articleId).toEqual(
      //   context.res?.body.comment.articleId
      // )
      // expect(savedComment.parentId).toEqual(context.res?.body.comment.parentId)
      // expect(savedComment.uid).toEqual(context.res?.body.comment.uid)
      // expect(savedComment.text).toEqual(context.res?.body.comment.text)
    } else {
      // 4xx or 5xx status codes
      expect(context.res?.body.errors).toBeTruthy()
    }
  }

  beforeEach(async () => {
    // Mock the relevant logging functions
    context = {
      log: jest.fn(),
      error: jest.fn(),
    } as unknown as Context

    const db = getGlobalDb()
    const user = getGlobalUser()
    uid1 = await user.create()
    uid2 = await user.create()
    token1 = await user.getToken(uid1)
    token2 = await user.getToken(uid2)
    commentsIds1 = await db.createMultipleComments(articleId, uid1, 7)
    commentsIds2 = await db.createMultipleComments(articleId, uid2, 5)
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test("should return an HTTP 200 response (with default values)", async () => {
    // Ensure all comments were created in the database
    const savedComments = []
    commentsIds1.push(...commentsIds2)
    commentsIds1.forEach(id => {
      savedComments.push(async () => {
        const db = getGlobalDb()
        const savedComment = await db.getSingleComment(articleId, id)
        expect(savedComment).toBeTruthy()
      })
    })
    await Promise.all(savedComments)

    const tc: TestCase<null, ParamType, QueryType> = {
      user: { uid: uid1 },
      request: {
        params: { aid: articleId },
        headers: { authorization: `Bearer ${token1}` },
      },
      expected: {
        statusCode: 200,
        message: "all comments retrieved successfully",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 200 response (with non-default values)", async () => {
    // Ensure all comments were created in the database
    const savedComments = []
    commentsIds1.push(...commentsIds2)
    commentsIds1.forEach(id => {
      savedComments.push(async () => {
        const db = getGlobalDb()
        const savedComment = await db.getSingleComment(articleId, id)
        expect(savedComment).toBeTruthy()
      })
    })
    await Promise.all(savedComments)

    const tc: TestCase<null, ParamType, QueryType> = {
      user: { uid: uid2 },
      request: {
        params: { aid: articleId },
        query: { limit: 10, page: 2 },
        headers: { authorization: `Bearer ${token2}` },
      },
      expected: {
        statusCode: 200,
        message: "all comments retrieved successfully",
      },
    }

    await runTestCase(tc)
  })

  // test("should return an HTTP 401 response (invalid user token)", async () => {
  //   const user = getGlobalUser()
  //   const db = getGlobalDb()
  //   const uid = await user.create()
  //   const id = await db.createSingleComment(uid)

  //   // Ensure the comment was  created in the database
  //   const savedComment = await db.getSingleComment(id)
  //   expect(savedComment).toBeTruthy()

  //   const tc: TestCase<null, { id: string }> = {
  //     user: { uid },
  //     request: {
  //       params: { id },
  //       headers: { authorization: "Bearer abc123" },
  //     },
  //     expected: {
  //       statusCode: 401,
  //       message: "unauthorized user",
  //     },
  //   }

  //   await runTestCase(tc)
  // })

  // test("should return an HTTP 404 response (invalid id)", async () => {
  //   const user = getGlobalUser()
  //   const db = getGlobalDb()
  //   const uid = await user.create()
  //   const token = await user.getToken(uid)
  //   const id = await db.createSingleComment(uid)

  //   // Ensure the comment was  created in the database
  //   const savedComment = await db.getSingleComment(id)
  //   expect(savedComment).toBeTruthy()

  //   const tc: TestCase<null, { id: string }> = {
  //     user: { uid },
  //     request: {
  //       params: { id: "abc123" },
  //       headers: { authorization: `Bearer ${token}` },
  //     },
  //     expected: {
  //       statusCode: 404,
  //       message: "comment not found",
  //     },
  //   }

  //   await runTestCase(tc)
  // })

  // test("should return an HTTP 422 response (no authorization header)", async () => {
  //   const user = getGlobalUser()
  //   const db = getGlobalDb()
  //   const uid = await user.create()
  //   const id = await db.createSingleComment(uid)

  //   // Ensure the comment was  created in the database
  //   const savedComment = await db.getSingleComment(id)
  //   expect(savedComment).toBeTruthy()

  //   const tc: TestCase<null, { id: string }> = {
  //     user: { uid },
  //     request: {
  //       params: { id },
  //       headers: {},
  //     },
  //     expected: {
  //       statusCode: 422,
  //       message: "invalid input supplied",
  //     },
  //   }

  //   await runTestCase(tc)
  // })

  // test("should return an HTTP 422 response (empty authorization header)", async () => {
  //   const user = getGlobalUser()
  //   const db = getGlobalDb()
  //   const uid = await user.create()
  //   const id = await db.createSingleComment(uid)

  //   // Ensure the comment was  created in the database
  //   const savedComment = await db.getSingleComment(id)
  //   expect(savedComment).toBeTruthy()

  //   const tc: TestCase<null, { id: string }> = {
  //     user: { uid },
  //     request: {
  //       params: { id },
  //       headers: { authorization: "" },
  //     },
  //     expected: {
  //       statusCode: 422,
  //       message: "invalid input supplied",
  //     },
  //   }

  //   await runTestCase(tc)
  // })

  // test("should return an HTTP 422 response (no id)", async () => {
  //   const user = getGlobalUser()
  //   const db = getGlobalDb()
  //   const uid = await user.create()
  //   const token = await user.getToken(uid)
  //   const id = await db.createSingleComment(uid)

  //   // Ensure the comment was  created in the database
  //   const savedComment = await db.getSingleComment(id)
  //   expect(savedComment).toBeTruthy()

  //   const tc: TestCase<null, { id?: string }> = {
  //     user: { uid },
  //     request: {
  //       params: {},
  //       headers: { authorization: `Bearer ${token}` },
  //     },
  //     expected: {
  //       statusCode: 422,
  //       message: "invalid input supplied",
  //     },
  //   }

  //   await runTestCase(tc)
  // })

  // test("should return an HTTP 422 response (empty id)", async () => {
  //   const user = getGlobalUser()
  //   const db = getGlobalDb()
  //   const uid = await user.create()
  //   const token = await user.getToken(uid)
  //   const id = await db.createSingleComment(uid)

  //   // Ensure the comment was  created in the database
  //   const savedComment = await db.getSingleComment(id)
  //   expect(savedComment).toBeTruthy()

  //   const tc: TestCase<null, { id?: string }> = {
  //     user: { uid },
  //     request: {
  //       params: { id: "" },
  //       headers: { authorization: `Bearer ${token}` },
  //     },
  //     expected: {
  //       statusCode: 422,
  //       message: "invalid input supplied",
  //     },
  //   }

  //   await runTestCase(tc)
  // })
})
