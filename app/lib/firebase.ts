import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { isKeyless, keylessFirestore } from "./gcp-keyless"

function getServiceAccount() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set")
  }
  return JSON.parse(key)
}

// Keyless (Vercel OIDC, see ./gcp-keyless) when its variables are set;
// otherwise the GOOGLE_SERVICE_ACCOUNT_KEY path exactly as before.
function getDb() {
  if (isKeyless()) return keylessFirestore()
  if (!getApps().length) {
    initializeApp({
      credential: cert(getServiceAccount()),
    })
  }
  return getFirestore()
}

export const db = getDb()
