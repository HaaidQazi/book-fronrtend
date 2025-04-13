'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'Owner',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        form
      )
      
      toast.success('Login successful!')
      localStorage.setItem('user', JSON.stringify(res.data.user))

      if (res.data.user.role === 'Owner') {
        router.push('/owner-dashboard')
      } else {
        router.push('/seeker-dashboard')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Toaster />

      <div className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl w-full">
        <div className="hidden lg:block flex-1">
          <img
            src="/undraw_reading-a-book_4cap.svg"
            alt="Login Illustration"
            className="w-full h-auto"
          />
        </div>

        <Card className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back 👋</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Login as</Label>
              <div className="flex gap-4 mt-2">
                {['Owner', 'Seeker'].map((role) => (
                  <label key={role} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={form.role === role}
                      onChange={handleChange}
                      className="accent-indigo-600"
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold rounded-xl"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-indigo-600 font-medium hover:underline">
              Register
            </a>
          </p>
        </Card>
      </div>
    </div>
  )
}
