import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Veuillez entrer une adresse email valide.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Always return success to prevent email enumeration
    // In production, you would send a real email here with a reset token
    if (user) {
      // TODO: In a real app, generate a reset token and send email:
      // const token = crypto.randomUUID()
      // await db.passwordReset.create({ data: { token, userId: user.id, expiresAt: new Date(Date.now() + 15 * 60 * 1000) } })
      // await sendResetEmail(user.email, token)
      console.log(`[Forgot Password] Reset requested for: ${user.email}`)
    }

    return NextResponse.json(
      { message: 'Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
