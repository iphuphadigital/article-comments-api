import * as path from "path"
import * as fs from "fs"
import { initializeApp, apps, credential } from "firebase-admin"

const getCredentials = () => {
  let filePath: string
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (credsPath) {
    filePath = path.join(__dirname, credsPath)
  } else {
    filePath = path.join(__dirname, "credentials.json")
  }

  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath).toString())
  }

  throw new Error("unable to load google application credentials")
}

const getInstance = () => {
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    return initializeApp({ projectId: process.env.GCLOUD_PROJECT }, "emulator")
  }
  if (apps.length > 0) {
    return apps[0]
  }
  return initializeApp({
    credential: credential.cert(getCredentials()),
    databaseURL: "https://phupha-digital.firebaseio.com",
  })
}

export default getInstance
