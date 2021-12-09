import { Context } from "@azure/functions"
import { handler as getArticleSingleComment } from "../../src/handlers/getArticleSingleComment"
import { getGlobalDb, getGlobalUser } from "../config/setup"
import { TestCase } from "../config/testCase"

type ParamType = { aid: string; id: string }

describe("handlers.getArticleSingleComment", () => {
  let context: Context
  const articleId = "article-id-1"

  const runTestCase = async (tc: TestCase<null, ParamType>) => {
    // Make the request
    await getArticleSingleComment(context, tc.request)

    if (context.res?.status === 500) {
      // eslint-disable-next-line no-console
      console.log(`runTestCase 500 error: ${JSON.stringify(context.res?.body)}`)
    }

    // Run test validations
    expect(context.res?.status).toBe(tc.expected.statusCode)
    expect(context.res?.body.message).toBe(tc.expected.message)

    if (context.res?.status === 200) {
      // We should also check if the database truly returned the correct
      // document and its data
      const db = getGlobalDb()
      const savedComment = await db.getSingleComment(
        articleId,
        tc.request.params?.id
      )
      expect(savedComment.articleId).toEqual(
        context.res?.body.comment.articleId
      )
      expect(savedComment.parentId).toEqual(context.res?.body.comment.parentId)
      expect(savedComment.uid).toEqual(context.res?.body.comment.uid)
      expect(savedComment.text).toEqual(context.res?.body.comment.text)
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
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test("should return an HTTP 200 response (user + with default values)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const id = await db.createSingleComment(articleId, uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(articleId, id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<null, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId, id },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 200,
        message: "comment retrieved successfully",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 401 response (invalid user token)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const id = await db.createSingleComment(articleId, uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(articleId, id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<null, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId, id },
        headers: { authorization: "Bearer abc123" },
      },
      expected: {
        statusCode: 401,
        message: "unauthorized user",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 404 response (invalid id)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const id = await db.createSingleComment(articleId, uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(articleId, id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<null, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId, id: "abc123" },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 404,
        message: "comment not found",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (no authorization header)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const id = await db.createSingleComment(articleId, uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(articleId, id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<null, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId, id },
        headers: {},
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (empty authorization header)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const id = await db.createSingleComment(articleId, uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(articleId, id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<null, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId, id },
        headers: { authorization: "" },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (no id)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const id = await db.createSingleComment(articleId, uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(articleId, id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<null, any> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (empty id)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const id = await db.createSingleComment(articleId, uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(articleId, id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<null, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId, id: "" },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })
})
