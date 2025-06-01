'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SSO Server POC
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Demonstration of Federated Single Sign-On with both redirect-based
            and silent authentication
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔐 SSO Server
                <Badge variant="secondary">sso.open.gov.sg</Badge>
              </CardTitle>
              <CardDescription>
                Central authentication server handling login and token
                management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Available Endpoints:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <code>/sso/authorize</code> - Authorization endpoint
                  </li>
                  <li>
                    • <code>/sso/token</code> - Token exchange
                  </li>
                  <li>
                    • <code>/sso/silent-auth</code> - Silent authentication
                  </li>
                  <li>
                    • <code>/sso/login</code> - Login page
                  </li>
                </ul>
              </div>
              <Link href="/sso/login">
                <Button className="w-full mt-8">Login to SSO </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Approaches</CardTitle>
              <CardDescription>
                This POC demonstrates both SSO approaches mentioned in your
                documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">
                    ✅ Redirect-based SSO
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Standard OIDC/OAuth2 flow</li>
                    <li>• Works in all browsers</li>
                    <li>• Visible redirect (brief)</li>
                    <li>• Highly reliable</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700">
                    🔄 Silent Authentication
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• iframe-based with postMessage</li>
                    <li>• Seamless user experience</li>
                    <li>• May be blocked by browser policies</li>
                    <li>• Requires fallback mechanism</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
