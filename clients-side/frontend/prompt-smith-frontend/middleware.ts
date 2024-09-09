import {NextRequest, NextResponse} from 'next/server'
import {decrypt} from '@/lib/session'
import {cookies} from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard', '/logout']
const publicRoutes = ['/login', '/signup', '/', 'simple-login']

const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}


const setHeaders = async (request: NextRequest) => {
  // Check the origin from the request
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && {'Access-Control-Allow-Origin': origin}),
      ...corsOptions,
    }
    return NextResponse.json({}, {headers: preflightHeaders})
  }

  // Handle simple requests
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)
  if (session?.bearerToken) {
    response.headers.set('Authorization', `Bearer ${session.bearerToken}`)
  }

  return response
}


const checkRedirect = async (req: NextRequest) => {

  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.bearerToken) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 6. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.bearerToken &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}


export default async function middleware(req: NextRequest) {


  if (req.nextUrl.pathname.startsWith('/api')) {
    return setHeaders(req)
  } else {
    return checkRedirect(req)
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
}
