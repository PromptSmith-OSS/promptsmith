import {NextRequest, NextResponse} from 'next/server'
import {cookies} from 'next/headers'


const allowedOrigins = ['http://localhost:3000', 'http://localhost:8000', "http://frontend:3000"]
const METHODS_EXCLUDE_ORIGIN = ['GET', 'OPTION']; // no origin for same site get and option

// .concat(IS_IN_DEVELOPMENT ? ['*'] : [])
const authRoutes = ['/login', '/signup']
const authAPIRoutes = ['/api/login-through-management-key'] // to be same as api route endpoint


/**
 * This will not be used because of rewrite rule in next.config.js
 * @param req
 */
const apiMiddleware = async (req: NextRequest) => {
  const isInPublicRoutes = authAPIRoutes.includes(req.nextUrl.pathname)

  let response;

  if (isInPublicRoutes) {
    // if the route is not protected, then we can skip the auth check
    response = NextResponse.next()
  } else {

    const origin = req.headers.get('Origin') || ''; // origin '' will be set for same site get
    console.log('request origin', origin)


    if (
      !(
        origin && allowedOrigins.includes(origin) ||  // allow all origins
        !origin && METHODS_EXCLUDE_ORIGIN.includes(req.method) // no origin from same site get and option
      )
    ) {
      console.error('403 Forbidden', origin, req.headers.get('Referer'), req.headers.get('User-Agent'))
      return new Response('Forbidden', {status: 403})
    }

    response = NextResponse.next()


    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Handle preflight request (OPTIONS method)
    if (req.method === 'OPTIONS') {
      response.headers.set('Access-Control-Max-Age', '86400') // Cache preflight for 24 hours
      return new Response(null, {status: 204, headers: response.headers})
    }
  }

  return response
}

/**
 * Middleware for page routes
 * Static or Server-Rendered Pages: These pages are loaded directly from the same origin, so CORS doesn't apply in this case.
 * @param req
 */
const pageMiddleware = async (req: NextRequest) => {
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isPublicRoute = authRoutes.includes(path)
  const isProtectedRoute = !isPublicRoute

  // Decrypt the session from the cookie
  const authenticatedInSession = cookies().get('sessionid')?.value

  // Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !authenticatedInSession) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    authenticatedInSession &&
    !req.nextUrl.pathname.startsWith('/prompt')
  ) {
    return NextResponse.redirect(new URL('/prompt', req.nextUrl))
  }
  return NextResponse.next()
}

/**
 * Middleware here will be called for both page and api routes requests
 * @param req
 */
export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api')) {
    // we cannot access cookie here, because it not from browser, but from the server rendering the server component pages
    return apiMiddleware(req)
  } else {
    // we can access the cookie session here, because it is directly request from browser
    return pageMiddleware(req)
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
}
