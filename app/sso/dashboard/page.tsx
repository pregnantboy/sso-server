'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface UserSession {
  email: string
  name: string
  authenticated: boolean
}

export default function SSODashboard() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/sso/session')
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setSession(data)
        } else {
          router.push('/sso/login')
        }
      } else {
        router.push('/sso/login')
      }
    } catch (err) {
      router.push('/sso/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/sso/logout', { method: 'POST' })
      router.push('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SSO Dashboard</h1>
            <p className="text-gray-600">Central authentication server</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👤 User Session
                <Badge variant="secondary">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> {session?.email}
                </p>
                <p>
                  <strong>Name:</strong> {session?.name}
                </p>
                <p>
                  <strong>Status:</strong> Authenticated
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Applications</CardTitle>
              <CardDescription>
                Applications using this SSO session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Client</span>
                  <Badge variant="secondary">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>SSO Server Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Authorization Endpoint:</strong>
                <br />
                <code className="text-xs">/api/sso/authorize</code>
              </div>
              <div>
                <strong>Token Endpoint:</strong>
                <br />
                <code className="text-xs">/api/sso/token</code>
              </div>
              <div>
                <strong>Silent Auth Endpoint:</strong>
                <br />
                <code className="text-xs">/api/sso/silent-auth</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
