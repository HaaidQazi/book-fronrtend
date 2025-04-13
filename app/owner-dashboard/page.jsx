'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'
import AddBookForm from '@/components/AddBookForm'
import BookCard from '@/components/BookCard'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function OwnerDashboard() {
  const [books, setBooks] = useState([])
  const [ownerId, setOwnerId] = useState(null)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (!storedUser || storedUser.role !== 'Owner') {
        toast.error('Unauthorized. Please login.')
        router.push('/login')
        return
      }

      setUser(storedUser)
      const id = Number(storedUser.id)
      setOwnerId(id)
      fetchBooks(id)
    } catch (error) {
      toast.error('Something went wrong while loading user info.')
      router.push('/login')
    }
  }, [])

  const fetchBooks = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`)
      const ownedBooks = res.data.filter((book) => book.ownerId === id)
      setBooks(ownedBooks)
    } catch (err) {
      toast.error('Failed to load books')
    }
  }

  const handleBookAdded = () => {
    if (ownerId) {
      fetchBooks(ownerId)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/dashboard-bg.jpg')" }}
    >
      <div className="min-h-screen w-full bg-white/70 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-indigo-700">📚 Owner Dashboard</h1>
              <p className="text-md text-gray-600 mt-1">
                Welcome back,{' '}
                <span className="font-medium text-gray-800">{user?.name}</span>!
              </p>
            </div>
            <Button
              aria-label="Logout"
              onClick={handleLogout}
              className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg"
            >
              Logout
            </Button>
          </div>

          {/* Add Book Form */}
          {ownerId !== null && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-12">
              <AddBookForm ownerId={ownerId} onBookAdded={handleBookAdded} />
            </div>
          )}

          {/* Book List */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📖 Your Books</h2>
            {books.length === 0 ? (
              <p className="text-gray-500">You haven&apos;t added any books yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} ownerView />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
