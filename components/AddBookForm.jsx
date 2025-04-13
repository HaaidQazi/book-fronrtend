'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function AddBookForm({ ownerId, onBookAdded }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    location: '',
    contact: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!ownerId) {
      toast.error('Owner ID not found')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE_URL}/api/books`, {
        ...form,
        ownerId
      })

      toast.success('Book added successfully!')
      onBookAdded()
      setForm({ title: '', author: '', genre: '', location: '', contact: '' })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error adding book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-indigo-700">Add a New Book</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <Input
          name="genre"
          placeholder="Genre (optional)"
          value={form.genre}
          onChange={handleChange}
        />
        <Input
          name="location"
          placeholder="City / Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <Input
          name="contact"
          placeholder="Contact Email / Phone"
          value={form.contact}
          onChange={handleChange}
          required
          className="md:col-span-2"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg"
        >
          {loading ? 'Adding...' : 'Add Book'}
        </Button>
      </div>
    </form>
  )
}
