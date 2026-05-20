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
    const { email, password } = body

    // Validation
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Veuillez entrer une adresse email valide.' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Veuillez entrer votre mot de passe.' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Aucun compte trouvé avec cette adresse email.' },
        { status: 404 }
      )
    }

    // Verify password
    const hashedPassword = await hashPassword(password)

    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect.' },
        { status: 401 }
      )
    }

    // Return user without password
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion.' },
      { status: 500 }
    )
  }
}
