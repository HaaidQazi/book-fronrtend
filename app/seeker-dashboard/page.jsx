'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import BookCard from '@/components/BookCard'
import { Button } from '@/components/ui/button'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SeekerDashboard() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [location, setLocation] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (!storedUser || storedUser.role !== 'Seeker') {
      toast.error('Unauthorized. Please login.')
      router.push('/login')
      return
    }

    setUser(storedUser)
    fetchAvailableBooks()
  }, [])

  const fetchAvailableBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`)
      const availableBooks = res.data.filter(book => book.status === 'available')
      setBooks(availableBooks)
    } catch (err) {
      toast.error('Failed to fetch books')
    }
  }

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(search.toLowerCase()) &&
      (genre ? book.genre?.toLowerCase().includes(genre.toLowerCase()) : true) &&
      (location ? book.location?.toLowerCase().includes(location.toLowerCase()) : true)
    )
  })

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url(dashboard-bg.jpg)' }}
    >
      <div className="min-h-screen w-full bg-white/70 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-purple-700">📚 Seeker Dashboard</h1>
              <p className="text-md text-gray-700 mt-1">
                Hello, <span className="font-medium text-gray-900">{user?.name}</span>!
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg"
            >
              Logout
            </Button>
          </div>

          {/* Filter Section */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Search & Filter</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-lg shadow-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Filter by genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="px-4 py-2 border rounded-lg shadow-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Filter by location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-4 py-2 border rounded-lg shadow-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Book Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <BookCard key={book.id} book={book} ownerView={false} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No books found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
