import User from "./user"

let user: User

const getGlobalUser = () => user

beforeAll(async () => {
  user = new User()
})

afterAll(async () => {
  await user.deleteAll()
})

export default getGlobalUser
