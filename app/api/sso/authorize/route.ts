import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Store authorization codes temporarily (in production, use Redis or database)
const authCodes = new Map<string, { client_id: string; user: any; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { client_id, redirect_uri, state } = await request.json()

    // Check if user is authenticated
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("sso_session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = JSON.parse(sessionCookie.value)

    // Generate authorization code
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Store code with expiration (5 minutes)
    authCodes.set(code, {
      client_id,
      user,
      expires: Date.now() + 5 * 60 * 1000,
    })

    return NextResponse.json({ code })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const client_id = url.searchParams.get("client_id")
  const redirect_uri = url.searchParams.get("redirect_uri")
  const state = url.searchParams.get("state")

  // Check if user is authenticated
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("sso_session")

  if (!sessionCookie) {
    // Redirect to login with parameters
    const loginUrl = new URL("/sso/login", request.url)
    if (client_id) loginUrl.searchParams.set("client_id", client_id)
    if (redirect_uri) loginUrl.searchParams.set("redirect_uri", redirect_uri)
    if (state) loginUrl.searchParams.set("state", state)

    return NextResponse.redirect(loginUrl)
  }

  const user = JSON.parse(sessionCookie.value)

  // Generate authorization code
  const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  // Store code with expiration (5 minutes)
  authCodes.set(code, {
    client_id: client_id!,
    user,
    expires: Date.now() + 5 * 60 * 1000,
  })

  // Redirect back to client with code
  const redirectUrl = new URL(redirect_uri!)
  redirectUrl.searchParams.set("code", code)
  if (state) redirectUrl.searchParams.set("state", state)

  return NextResponse.redirect(redirectUrl)
}

// Export the authCodes for use in token endpoint
export { authCodes }
