import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const client_id = url.searchParams.get('client_id')
  const redirect_uri = url.searchParams.get('redirect_uri')

  try {
    // Check if user is authenticated via SSO session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('sso_session')

    if (!sessionCookie) {
      // Return HTML that posts failure message
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head><title>Silent Auth</title></head>
        <body>
          <script>
            window.parent.postMessage({
              type: 'SSO_AUTH_NONE',
              error: 'No session'
            }, '*');
          </script>
        </body>
        </html>
      `,
        {
          headers: { 'Content-Type': 'text/html' },
        }
      )
    }

    const user = JSON.parse(sessionCookie.value)

    // Generate authorization code
    const code =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)

    // Store code (reuse the authCodes from authorize route)
    const { authCodes } = await import('../authorize/route')
    authCodes.set(code, {
      client_id: client_id!,
      user,
      expires: Date.now() + 5 * 60 * 1000,
    })

    // Return HTML that posts success message with code
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head><title>Silent Auth</title></head>
      <body>
        <script>
          window.parent.postMessage({
            type: 'SSO_AUTH_SUCCESS',
            code: '${code}'
          }, '*');
        </script>
      </body>
      </html>
    `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  } catch (error) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head><title>Silent Auth</title></head>
      <body>
        <script>
          window.parent.postMessage({
            type: 'SSO_AUTH_FAILED',
            error: 'Server error'
          }, '*');
        </script>
      </body>
      </html>
    `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }
}
