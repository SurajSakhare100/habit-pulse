import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import { Note } from '@/models/Note'
import User from '@/models/User'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const habitId = searchParams.get('habitId')

    await dbConnect()
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const query: any = { userId: user._id }
    if (habitId) {
      query.habitId = habitId
    }

    const journal = await Note.find(query)
      .sort({ date: -1, time: -1 })
      .populate('habitId', 'habitName emoji')

    return NextResponse.json(journal)
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, habitId, date } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Validate date
    const journalDate = date ? new Date(date) : new Date()
    const now = new Date()
    if (journalDate > now) {
      return NextResponse.json(
        { error: 'Cannot add journal entries for future dates' },
        { status: 400 }
      )
    }

    await dbConnect()
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check for existing note on the same day
    const startOfDay = new Date(journalDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(journalDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingNote = await Note.findOne({
      userId: user._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })

    if (existingNote) {
      return NextResponse.json(
        { error: 'You can only create one journal entry per day' },
        { status: 400 }
      )
    }

    const journal = await Note.create({
      title,
      content,
      userId: user._id,
      habitId: habitId || null,
      date: journalDate,
      time: new Date().toLocaleTimeString(),
    })

    return NextResponse.json(journal)
  } catch (error) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    )
  }
} 