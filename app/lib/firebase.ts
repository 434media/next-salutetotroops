import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function getServiceAccount() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set")
  }
  return JSON.parse(key)
}

if (!getApps().length) {
  initializeApp({
    credential: cert(getServiceAccount()),
  })
}

export const db = getFirestore()
