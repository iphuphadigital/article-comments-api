import { Context } from "@azure/functions"
import { handler as deleteSingle } from "../../src/handlers/deleteSingle"
import { CreateComment } from "../../src/models"
import { getGlobalDb, getGlobalUser } from "../config/setup"
import { TestCase } from "../config/testCase"

describe("handlers.deleteSingle", () => {
  let context: Context

  const runTestCase = async (tc: TestCase<CreateComment>) => {
    // Make the request
    await deleteSingle(context, tc.request)

    if (context.res?.status === 500) {
      // eslint-disable-next-line no-console
      console.log(`runTestCase 500 error: ${JSON.stringify(context.res?.body)}`)
    }

    // Run test validations
    expect(context.res?.status).toBe(tc.expected.statusCode)
    expect(context.res?.body.message).toBe(tc.expected.message)

    if (context.res?.status === 200) {
      // We should also check if the database truly deleted the document and its data
      const db = getGlobalDb()
      const savedComment = await db.getSingleComment(tc.request.params?.id)
      expect(savedComment).toBeNull()
    } else {
      // 4xx or 5xx status codes
      expect(context.res?.body.errors).toBeTruthy()

      // We should also check if the database did not delete the document and its data
      const id = tc.request.params?.id
      if (id) {
        const db = getGlobalDb()
        const savedComment = await db.getSingleComment(id)
        expect(savedComment).toBeTruthy()
      }
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
    const id = await db.createSingleComment(uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<any, { id: string }> = {
      user: { uid },
      request: {
        params: {
          id,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 200,
        message: "comment deleted successfully",
      },
    }

    await runTestCase(tc)
  })

  test("should return an HTTP 401 response (invalid user token)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const id = await db.createSingleComment(uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<any, { id: string }> = {
      user: { uid },
      request: {
        params: {
          id,
        },
        headers: { authorization: "Bearer abc123" },
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
    const db = getGlobalDb()
    const uid = await user.create()
    const id = await db.createSingleComment(uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<any, { id: string }> = {
      user: { uid },
      request: {
        params: {
          id,
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
    const db = getGlobalDb()
    const uid = await user.create()
    const id = await db.createSingleComment(uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<any, { id: string }> = {
      user: { uid },
      request: {
        params: {
          id,
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

  test("should return an HTTP 422 response (no id)", async () => {
    const user = getGlobalUser()
    const db = getGlobalDb()
    const uid = await user.create()
    const token = await user.getToken(uid)
    const id = await db.createSingleComment(uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<any, { id?: string }> = {
      user: { uid },
      request: {
        params: {},
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
    const id = await db.createSingleComment(uid)

    // Ensure the comment was  created in the database
    const savedComment = await db.getSingleComment(id)
    expect(savedComment).toBeTruthy()

    const tc: TestCase<any, { id?: string }> = {
      user: { uid },
      request: {
        params: { id: "" },
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
