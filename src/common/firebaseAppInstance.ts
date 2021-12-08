import * as path from "path"
import * as fs from "fs"
import * as admin from "firebase-admin"

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
  if (admin.apps.length > 0) {
    return admin.apps[0]
  }

  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    return admin.initializeApp(
      { projectId: process.env.GCLOUD_PROJECT },
      "emulator"
    )
  }

  return admin.initializeApp({
    credential: admin.credential.cert(getCredentials()),
    databaseURL: "https://phupha-digital.firebaseio.com",
  })
}

export default getInstance
