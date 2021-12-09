import { initializeApp, getApps } from "firebase/app"
import User from "./user"
import FirebaseService from "../../src/common/firebaseService"
import getInstance from "../../src/common/firebaseAppInstance"
import TestDatabase from "./testDatabase"

let user: User
let db: TestDatabase

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
  const firebaseService = FirebaseService.getInstance(adminApp)
  user = new User(app)
  db = new TestDatabase(firebaseService.firestore)
})

afterAll(async () => {
  await Promise.all([user.deleteAll(), db.deleteAll()])
})

export { getGlobalUser, getGlobalDb }
