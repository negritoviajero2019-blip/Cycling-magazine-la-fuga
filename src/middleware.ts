import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

/** Protege /admin/* (excepto /admin/login) — requiere sesión válida. */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
