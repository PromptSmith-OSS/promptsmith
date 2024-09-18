import 'server-only' // this could not be used in the client side
import {cookies} from 'next/headers'
import {SignJWT, jwtVerify} from 'jose'
import {SessionPayload} from '@/lib/definitions'
import {IS_IN_DEVELOPMENT} from "@/lib/utils";

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const {payload} = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Failed to decrypt session', error)
  }
}

export async function createSimpleAuthSession(bearerToken: string) {
  const session = await encrypt({bearerToken})

  console.log('session', process.env.NODE_ENV)

  cookies().set('session', session, {
    httpOnly: true,
    secure: !IS_IN_DEVELOPMENT,
    maxAge: 7 * 24 * 60 * 60,
    // sameSite: 'lax,
    sameSite: 'none',
    path: '/',
  })

  console.log('session', cookies().get('session')?.value)
}


export async function updateSimpleAuthSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}


export function deleteSession() {
  cookies().delete('session')
}


export const getBearerTokenFromSession = async (): Promise<string> => {
  const cookie = cookies().get('session')?.value
  if (!cookie) {
    return ''
  }

  const session = await decrypt(cookie)
  if (session?.bearerToken) {
    return session.bearerToken as string
  } else {
    return ''
  }
}


/**
 * https://github.com/pennersr/django-allauth/blob/c031add73ccac4d2f8517037a99d56d2598377f9/examples/react-spa/frontend/src/lib/django.js#L15
 * @param name
 */
function getCookie (name:string) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}
export function getCSRFToken () {
  return getCookie('csrftoken')
}
