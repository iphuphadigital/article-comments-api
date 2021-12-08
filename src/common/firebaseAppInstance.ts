import * as path from "path"
import * as fs from "fs"
// eslint-disable-next-line import/no-unresolved
import { initializeApp, getApps, cert } from "firebase-admin/app"

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
  if (getApps().length > 0) {
    return getApps()[0]
  }
  return initializeApp({
    credential: cert(getCredentials()),
    databaseURL: "https://phupha-digital.firebaseio.com",
  })
}

export default getInstance
