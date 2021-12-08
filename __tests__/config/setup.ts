import { initializeApp, getApps } from "firebase/app"
import User from "./user"
import Database from "./database"
import getInstance from "../../src/common/firebaseAppInstance"

let user: User
let db: Database

const getGlobalUser = () => user
const getGlobalDb = () => db

const firebaseConfig = {
  apiKey: "apikey",
  projectId: process.env.GCLOUD_PROJECT,
}

jest.setTimeout(10000)

beforeAll(async () => {
  const apps = getApps()
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)
  const adminApp = getInstance()
  user = new User(app)
  db = new Database(adminApp)
})

afterAll(async () => {
  await Promise.all([user.deleteAll(), db.deleteAll()])
})

export { getGlobalUser, getGlobalDb }
