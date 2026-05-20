import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le nom doit contenir au moins 2 caractères.' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Veuillez entrer une adresse email valide.' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cette adresse email existe déjà.' },
        { status: 409 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        plan: 'gratuit',
      },
    })

    // Return user without password
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du compte.' },
      { status: 500 }
    )
  }
}
