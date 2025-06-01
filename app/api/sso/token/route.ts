import { type NextRequest, NextResponse } from "next/server"
import { authCodes } from "../authorize/route"

export async function POST(request: NextRequest) {
  try {
    const { code, client_id, redirect_uri } = await request.json()

    // Validate authorization code
    const authData = authCodes.get(code)

    if (!authData) {
      return NextResponse.json({ error: "Invalid authorization code" }, { status: 400 })
    }

    if (authData.expires < Date.now()) {
      authCodes.delete(code)
      return NextResponse.json({ error: "Authorization code expired" }, { status: 400 })
    }

    if (authData.client_id !== client_id) {
      return NextResponse.json({ error: "Client ID mismatch" }, { status: 400 })
    }

    // Delete used code
    authCodes.delete(code)

    // Generate access token (in production, use proper JWT)
    const accessToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    return NextResponse.json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      user: authData.user,
    })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
