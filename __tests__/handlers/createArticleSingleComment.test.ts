import { Context } from "@azure/functions"
import { handler as createArticleSingleComment } from "../../src/handlers/createArticleSingleComment"
import { CreateComment } from "../../src/models"
import { getGlobalDb, getGlobalUser } from "../config/setup"
import { TestCase } from "../config/testCase"

type ParamType = { aid: string }

describe("handlers.createArticleSingleComment", () => {
  let context: Context
  const articleId = "article-id-createArticleSingleComment"

  const runTestCase = async (tc: TestCase<CreateComment, ParamType>) => {
    // Make the request
    await createArticleSingleComment(context, tc.request)

    if (context.res?.status === 500) {
      // eslint-disable-next-line no-console
      console.log(`runTestCase 500 error: ${JSON.stringify(context.res?.body)}`)
    }

    // Run test validations
    expect(context.res?.status).toBe(tc.expected.statusCode)
    expect(context.res?.body.message).toBe(tc.expected.message)

    if (context.res?.status === 201) {
      // 201 status code
      expect(context.res?.body.id).toBeTruthy()
      expect(context.res?.body.errors).toBeUndefined()

      // We should also check if the database truly inserted the new document and its data
      const db = getGlobalDb()
      const savedComment = await db.getSingleComment(
        articleId,
        context.res?.body.id
      )
      expect(savedComment.parentId).toBe(tc.request.body.parentId)
      expect(savedComment.articleId).toBe(tc.request.body.articleId)
      expect(savedComment.uid).toBe(tc.user.uid)
      expect(savedComment.text).toBe(tc.request.body.text)
    } else {
      // 4xx or 5xx status codes
      expect(context.res?.body.errors).toBeTruthy()
      expect(context.res?.body.id).toBeUndefined()
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

  test("should return an HTTP 201 response (user + with default values)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const parentId = null

    const tc: TestCase<CreateComment, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 201,
        message: "comment created successfully",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 201 response (user + with default values + non-null parentId)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const parentId = "df23daAFef3fA30ad"

    const tc: TestCase<CreateComment, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 201,
        message: "comment created successfully",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 401 response (invalid user token)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const parentId = null

    const tc: TestCase<CreateComment, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
        headers: { authorization: `Bearer abc123` },
      },
      expected: {
        statusCode: 401,
        message: "unauthorized user",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (no authorization header)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const parentId = null

    const tc: TestCase<any, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
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
    const uid = await user.create()
    const parentId = null

    const tc: TestCase<any, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
        headers: { authorization: "" },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (no articleId)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const parentId = null

    const tc: TestCase<any, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (empty articleId)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const parentId = null

    const tc: TestCase<any, ParamType> = {
      user: { uid },
      request: {
        params: { aid: "" },
        body: {
          articleId,
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (no parentId)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const parentId = null

    const tc: TestCase<any, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (empty parentId)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const parentId = ""

    const tc: TestCase<any, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and articleId ${articleId}`,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (no text)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const parentId = null

    const tc: TestCase<any, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          parentId,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 422,
        message: "invalid input supplied",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 422 response (empty text)", async () => {
    const user = getGlobalUser()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const parentId = null

    const tc: TestCase<any, ParamType> = {
      user: { uid },
      request: {
        params: { aid: articleId },
        body: {
          articleId,
          parentId,
          text: "",
        },
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
