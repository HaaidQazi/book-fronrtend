'use client'

import { Card } from './ui/card'
import { Button } from './ui/button'
import toast from 'react-hot-toast'
import axios from 'axios'
import { BookOpen, User, MapPin, Phone, Tag } from 'lucide-react'
import clsx from 'clsx'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function BookCard({ book, ownerView = false }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/books/${book.id}`, {
        data: { ownerId: book.ownerId },
      })
      toast.success('Book deleted')
      location.reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed')
    }
  }

  const handleStatusToggle = async (newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/books/${book.id}/status`, {
        status: newStatus,
      })
      toast.success(`Marked as ${newStatus}`)
      location.reload()
    } catch (err) {
      toast.error('Status update failed')
    }
  }

  const statusColor = clsx(
    'px-2 py-0.5 rounded-full text-xs font-semibold w-fit',
    book.status === 'available'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-700'
  )

  return (
    <Card className="p-5 shadow-md bg-gray-50 border border-gray-200 rounded-xl space-y-3 transition hover:shadow-lg">
      <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
        <BookOpen size={18} />
        {book.title}
      </h3>

      <div className="text-sm space-y-1 text-gray-700">
        <p className="flex items-center gap-2">
          <User size={16} /> Author: <span className="font-medium">{book.author}</span>
        </p>

        {book.genre && (
          <p className="flex items-center gap-2">
            <Tag size={16} /> Genre: {book.genre}
          </p>
        )}

        <p className="flex items-center gap-2">
          <MapPin size={16} /> Location: {book.location}
        </p>

        <p className="flex items-center gap-2">
          <Phone size={16} /> Contact: {book.contact}
        </p>

        <p className={statusColor}>Status: {book.status}</p>
      </div>

      {ownerView && (
        <div className="flex flex-col sm:flex-row gap-2 pt-3">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              handleStatusToggle(book.status === 'available' ? 'rented' : 'available')
            }
          >
            {book.status === 'available' ? 'Mark as Rented' : 'Mark as Available'}
          </Button>
        </div>
      )}
    </Card>
  )
}
