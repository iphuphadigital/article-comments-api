import { Context } from "@azure/functions"
import { handler as createSingle } from "../../src/handlers/createSingle"
import { CreateComment } from "../../src/models"
import getGlobalUser from "../config/setup"
import { TestCase } from "../config/testCase"

describe("handlers.createSingle", () => {
  let context: Context

  const runTestCase = async (tc: TestCase<CreateComment>) => {
    // Make the request
    await createSingle(context, tc.request)

    if (context.res?.status === 500) {
      // eslint-disable-next-line no-console
      console.log(`runTestCase 500 error: ${JSON.stringify(context.res?.body)}`)
    }

    // Run test validations
    expect(context.res?.status).toBe(201)
    expect(context.res?.body.statusCode).toBe(201)
    expect(context.res?.body.message).toBe("status created successfully")
    expect(context.res?.body.success).toBe(true)
    expect(context.res?.body.errors).toBeUndefined()
    expect(context.res?.body.id).toBeTruthy()

    // const savedStatus = await findCommentById(context.res?.body.id)
    // expect(savedStatus.availability).toBe("Online")
    // expect(savedStatus.message).toBe(message)
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
    const reference = "article-id-1"
    const parentId = null

    const tc: TestCase<CreateComment> = {
      user: { uid },
      request: {
        body: {
          uid,
          reference,
          parentId,
          text: `this is a comment created by ${uid} with parent comment ${parentId} and reference ${reference}`,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      expected: {
        statusCode: 201,
        message: "comment created successfully",
        success: true,
      },
    }

    await runTestCase(tc)
  })
})
