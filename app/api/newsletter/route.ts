import { type NextRequest, NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { db } from "@/app/lib/firebase"
import { FieldValue } from "firebase-admin/firestore"
import crypto from "crypto"

const mailchimpApiKey = process.env.MAILCHIMP_API_KEY
const mailchimpListId = process.env.MAILCHIMP_AUDIENCE_ID
const mailchimpDatacenter = mailchimpApiKey ? mailchimpApiKey.split("-").pop() : null

const NEWSLETTER_TAGS = ["web-salutetotroops", "newsletter-signup"]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type MailchimpResult = { status: number; json: boolean; data: { title?: string } | null }

// Only a short, well-formed email string is stored or sent to Mailchimp.
function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const email = value.trim().toLowerCase()
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return null
  return email
}

// Calls the Mailchimp API with native fetch. A 4xx comes back as a status, not a
// thrown error, so every outcome is handled below; errors never carry the request,
// so the API key cannot end up in a log line.
async function mailchimp(path: string, method: "POST", body: unknown): Promise<MailchimpResult> {
  const res = await fetch(`https://${mailchimpDatacenter}.api.mailchimp.com/3.0/lists/${mailchimpListId}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`apikey:${mailchimpApiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  const json = (res.headers.get("content-type") ?? "").includes("json")
  const data = json && res.status !== 204 ? await res.json().catch(() => null) : null
  return { status: res.status, json, data }
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request is not from a bot
    const verification = await checkBotId()
    if (verification.isBot) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Reject oversized bodies before parsing: a signup is one short email.
    const length = Number(request.headers.get("content-length") ?? 0)
    if (length > 2048) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 })
    }

    const body = await request.json().catch(() => null)
    const email = normalizeEmail(body?.email)
    if (!email) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const mailchimpEnabled = Boolean(mailchimpApiKey && mailchimpListId)
    if (!mailchimpEnabled) {
      console.warn("Mailchimp integration disabled - missing API key or Audience ID")
    }

    // Save to Firestore
    const firestorePromise = db.collection("newsletter_signups").add({
      email,
      source: "Salute",
      createdAt: FieldValue.serverTimestamp(),
    })

    const promises: Promise<unknown>[] = [firestorePromise]
    if (mailchimpEnabled) {
      promises.push(mailchimp("/members", "POST", { email_address: email, status: "subscribed", tags: NEWSLETTER_TAGS }))
    }

    const results = await Promise.allSettled(promises)
    const firestoreResult = results[0]
    const mailchimpResult = mailchimpEnabled ? (results[1] as PromiseSettledResult<MailchimpResult>) : null

    const errors: string[] = []

    if (firestoreResult.status === "rejected") {
      console.error("Firestore save failed:", String(firestoreResult.reason))
      errors.push("Firestore save failed")
    }

    if (mailchimpResult) {
      if (mailchimpResult.status === "rejected") {
        console.error("Mailchimp request failed:", String(mailchimpResult.reason))
        errors.push("Mailchimp subscription failed")
      } else {
        const { status, json, data } = mailchimpResult.value
        if (status >= 200 && status < 300) {
          // Subscribed.
        } else if (!json) {
          console.error(`Mailchimp returned a non-JSON ${status} response - likely an authentication issue`)
          errors.push("Mailchimp authentication failed")
        } else if (data?.title === "Member Exists") {
          // Already on the list: add the tags through the member's tags endpoint.
          const emailHash = crypto.createHash("md5").update(email).digest("hex")
          try {
            const tagged = await mailchimp(`/members/${emailHash}/tags`, "POST", {
              tags: NEWSLETTER_TAGS.map((name) => ({ name, status: "active" })),
            })
            if (tagged.status >= 300) {
              console.error(`Mailchimp tag update returned ${tagged.status}`)
              errors.push("Mailchimp update failed")
            }
          } catch (updateError) {
            console.error("Mailchimp tag update failed:", String(updateError))
            errors.push("Mailchimp update failed")
          }
        } else {
          console.error(`Mailchimp subscription returned ${status}: ${data?.title ?? "unknown error"}`)
          errors.push("Mailchimp subscription failed")
        }
      }
    }

    const totalServices = mailchimpEnabled ? 2 : 1
    if (errors.length < totalServices) {
      // Partial failures are logged above; the caller learns nothing about the backends.
      return NextResponse.json({ message: "Newsletter subscription successful" }, { status: 200 })
    }
    return NextResponse.json({ error: "An error occurred while subscribing to the newsletter" }, { status: 500 })
  } catch {
    console.error("Newsletter subscription error occurred")
    return NextResponse.json({ error: "An error occurred while subscribing to the newsletter" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
