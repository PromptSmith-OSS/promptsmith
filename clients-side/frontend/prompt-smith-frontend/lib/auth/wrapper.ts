'user client'
import {getCSRFToken} from './cookieUtils'

// https://github.com/pennersr/django-allauth/blob/main/examples/react-spa/frontend/src/lib/allauth.js


const CLIENT = 'browser'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/bff';

const BASE_URL = `${siteUrl}/auth/${CLIENT}/v1`
const ACCEPT_JSON = {
  accept: 'application/json',
}

interface PayloadBody extends Record<string, unknown> {
}

interface Headers extends Record<string, string> {
}


interface RequestOptions {
  method: string;
  headers: {
    accept?: string;
    'X-CSRFToken'?: string;
    'Content-Type'?: string;
    'X-Email-Verification-Key'?: string;
    'X-Password-Reset-Key'?: string;

  };
  credentials?: string;
  body?: string;
}

export const AuthProcess = Object.freeze({
  LOGIN: 'login',
  CONNECT: 'connect'
})

export const Flows = Object.freeze({
  VERIFY_EMAIL: 'verify_email',
  LOGIN: 'login',
  LOGIN_BY_CODE: 'login_by_code',
  SIGNUP: 'signup',
  PROVIDER_REDIRECT: 'provider_redirect',
  PROVIDER_SIGNUP: 'provider_signup',
  MFA_AUTHENTICATE: 'mfa_authenticate',
  REAUTHENTICATE: 'reauthenticate',
  MFA_REAUTHENTICATE: 'mfa_reauthenticate'
})

export const URLs = Object.freeze({
  // Meta
  CONFIG: BASE_URL + '/config',
  INIT: siteUrl + '/auth/browser/init',

  // Account management
  CHANGE_PASSWORD: BASE_URL + '/account/password/change',
  EMAIL: BASE_URL + '/account/email',
  PROVIDERS: BASE_URL + '/account/providers',

  // Account management: 2FA
  AUTHENTICATORS: BASE_URL + '/account/authenticators',
  RECOVERY_CODES: BASE_URL + '/account/authenticators/recovery-codes',
  TOTP_AUTHENTICATOR: BASE_URL + '/account/authenticators/totp',

  // Auth: Basics
  LOGIN: BASE_URL + '/auth/login',
  REQUEST_LOGIN_CODE: BASE_URL + '/auth/code/request',
  CONFIRM_LOGIN_CODE: BASE_URL + '/auth/code/confirm',
  SESSION: BASE_URL + '/auth/session',
  REAUTHENTICATE: BASE_URL + '/auth/reauthenticate',
  REQUEST_PASSWORD_RESET: BASE_URL + '/auth/password/request',
  RESET_PASSWORD: BASE_URL + '/auth/password/reset',
  SIGNUP: BASE_URL + '/auth/signup',
  VERIFY_EMAIL: BASE_URL + '/auth/email/verify',

  // Auth: 2FA
  MFA_AUTHENTICATE: BASE_URL + '/auth/2fa/authenticate',
  MFA_REAUTHENTICATE: BASE_URL + '/auth/2fa/reauthenticate',

  // Auth: Social
  PROVIDER_SIGNUP: BASE_URL + '/auth/provider/signup',
  REDIRECT_TO_PROVIDER: BASE_URL + '/auth/provider/redirect',
  PROVIDER_TOKEN: BASE_URL + '/auth/provider/token',

  // Auth: Sessions
  SESSIONS: BASE_URL + '/auth/sessions',

  // Auth: WebAuthn
  REAUTHENTICATE_WEBAUTHN: BASE_URL + '/auth/webauthn/reauthenticate',
  AUTHENTICATE_WEBAUTHN: BASE_URL + '/auth/webauthn/authenticate',
  LOGIN_WEBAUTHN: BASE_URL + '/auth/webauthn/login',
  WEBAUTHN_AUTHENTICATOR: BASE_URL + '/account/authenticators/webauthn'
})

export const AuthenticatorType = Object.freeze({
  TOTP: 'totp',
  RECOVERY_CODES: 'recovery_codes',
  WEBAUTHN: 'webauthn'
})


function postForm(action: string, data: PayloadBody) {
  const f = document.createElement('form')
  f.method = 'POST'
  f.action = action

  for (const key in data) {
    const d = document.createElement('input')
    d.type = 'hidden'
    d.name = key
    d.value = <string>data[key]
    f.appendChild(d)
  }
  document.body.appendChild(f)
  f.submit()
}


async function request(method: string, path: string, data?: PayloadBody, headers?: Headers) {
  const options: RequestOptions = {
    method,
    headers: {
      ...ACCEPT_JSON,
      ...headers
    },
    credentials: 'include',
    body: undefined
  }
  // Don't pass along authentication related headers to the config endpoint.
  if (path !== URLs.CONFIG && path !== URLs.INIT) {
    options.headers['X-CSRFToken'] = getCSRFToken()
  }

  if (!!data) {
    options.body = JSON.stringify(data)
    options.headers['Content-Type'] = 'application/json'
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const resp = await fetch(path, options as RequestOptions)
  const msg = await resp.json()
  if (msg.status === 410) {
    if (typeof window !== 'undefined') {
      const tokenStorage = window?.sessionStorage
      tokenStorage.removeItem('sessionToken')
    }
  }
  if (msg.meta?.session_token) {
    if (typeof window !== 'undefined') {
      const tokenStorage = window?.sessionStorage
      tokenStorage.setItem('sessionToken', msg.meta.session_token)
    }
  }
  if ([401, 410].includes(msg.status) || (msg.status === 200 && msg.meta?.is_authenticated)) {
    const event = new CustomEvent('allauth.auth.change', {detail: msg})
    document.dispatchEvent(event)
  }
  return msg
}

export async function login(data: PayloadBody) {
  return await request('POST', URLs.LOGIN, data)
}


export async function reauthenticate(data: PayloadBody) {
  return await request('POST', URLs.REAUTHENTICATE, data)
}

export async function logout() {
  return await request('DELETE', URLs.SESSION)
}

export async function signUp(data: PayloadBody) {
  return await request('POST', URLs.SIGNUP, data)
}

export async function providerSignup(data: PayloadBody) {
  return await request('POST', URLs.PROVIDER_SIGNUP, data)
}

export async function getProviderAccounts() {
  return await request('GET', URLs.PROVIDERS)
}

export async function disconnectProviderAccount(providerId: string, accountUid: string) {
  return await request('DELETE', URLs.PROVIDERS, {provider: providerId, account: accountUid})
}

export async function requestPasswordReset(email: string) {
  return await request('POST', URLs.REQUEST_PASSWORD_RESET, {email})
}

export async function requestLoginCode(email: string) {
  return await request('POST', URLs.REQUEST_LOGIN_CODE, {email})
}

export async function confirmLoginCode(code: string) {
  return await request('POST', URLs.CONFIRM_LOGIN_CODE, {code})
}

export async function getEmailVerification(key: string) {
  return await request('GET', URLs.VERIFY_EMAIL, undefined, {'X-Email-Verification-Key': key})
}

export async function getEmailAddresses() {
  return await request('GET', URLs.EMAIL)
}

export async function getSessions() {
  return await request('GET', URLs.SESSIONS)
}

export async function endSessions(ids: string) {
  return await request('DELETE', URLs.SESSIONS, {sessions: ids})
}

export async function getAuthenticators() {
  return await request('GET', URLs.AUTHENTICATORS)
}

export async function getTOTPAuthenticator() {
  return await request('GET', URLs.TOTP_AUTHENTICATOR)
}

export async function mfaAuthenticate(code: string) {
  return await request('POST', URLs.MFA_AUTHENTICATE, {code})
}

export async function mfaReauthenticate(code: string) {
  return await request('POST', URLs.MFA_REAUTHENTICATE, {code})
}

export async function activateTOTPAuthenticator(code: string) {
  return await request('POST', URLs.TOTP_AUTHENTICATOR, {code})
}

export async function deactivateTOTPAuthenticator() {
  return await request('DELETE', URLs.TOTP_AUTHENTICATOR)
}

export async function getRecoveryCodes() {
  return await request('GET', URLs.RECOVERY_CODES)
}

export async function generateRecoveryCodes() {
  return await request('POST', URLs.RECOVERY_CODES)
}

export async function getConfig() {
  return await request('GET', URLs.CONFIG)
}

export async function init() {
  return await request('GET', URLs.INIT)
}

export async function addEmail(email: string) {
  return await request('POST', URLs.EMAIL, {email})
}

export async function deleteEmail(email: string) {
  return await request('DELETE', URLs.EMAIL, {email})
}

export async function markEmailAsPrimary(email: string) {
  return await request('PATCH', URLs.EMAIL, {email, primary: true})
}

export async function requestEmailVerification(email: string) {
  return await request('PUT', URLs.EMAIL, {email})
}

export async function verifyEmail(key: string) {
  return await request('POST', URLs.VERIFY_EMAIL, {key})
}

export async function getPasswordReset(key: string) {
  return await request('GET', URLs.RESET_PASSWORD, undefined, {'X-Password-Reset-Key': key})
}

export async function resetPassword(data: PayloadBody) {
  return await request('POST', URLs.RESET_PASSWORD, data)
}

export async function changePassword(data: PayloadBody) {
  return await request('POST', URLs.CHANGE_PASSWORD, data)
}

export async function getAuth() {
  return await request('GET', URLs.SESSION)
}

export async function authenticateByToken(providerId: string, token: string, process = AuthProcess.LOGIN) {
  return await request('POST', URLs.PROVIDER_TOKEN, {
      provider: providerId,
      token,
      process
    }
  )
}

export function redirectToProvider(providerId: string, callbackURL: string, process = AuthProcess.LOGIN) {
  postForm(URLs.REDIRECT_TO_PROVIDER, {
    provider: providerId,
    process,
    callback_url: callbackURL,
    csrfmiddlewaretoken: getCSRFToken()
  })
}

export async function getWebAuthnCreateOptions(passwordless: boolean) {
  let url = URLs.WEBAUTHN_AUTHENTICATOR
  if (passwordless) {
    url += '?passwordless'
  }
  return await request('GET', url)
}

export async function addWebAuthnCredential(name: string, credential: string) {
  return await request('POST', URLs.WEBAUTHN_AUTHENTICATOR, {
    name,
    credential
  })
}

export async function deleteWebAuthnCredential(ids: string) {
  return await request('DELETE', URLs.WEBAUTHN_AUTHENTICATOR, {authenticators: ids})
}

export async function updateWebAuthnCredential(id: string, data: PayloadBody) {
  return await request('PUT', URLs.WEBAUTHN_AUTHENTICATOR, {id, ...data})
}

export async function getWebAuthnRequestOptionsForReauthentication() {
  return await request('GET', URLs.REAUTHENTICATE_WEBAUTHN)
}

export async function reauthenticateUsingWebAuthn(credential: string) {
  return await request('POST', URLs.REAUTHENTICATE_WEBAUTHN, {credential})
}

export async function authenticateUsingWebAuthn(credential: string) {
  return await request('POST', URLs.AUTHENTICATE_WEBAUTHN, {credential})
}

export async function loginUsingWebAuthn(credential: string) {
  return await request('POST', URLs.LOGIN_WEBAUTHN, {credential})
}

export async function getWebAuthnRequestOptionsForLogin() {
  return await request('GET', URLs.LOGIN_WEBAUTHN)
}

export async function getWebAuthnRequestOptionsForAuthentication() {
  return await request('GET', URLs.AUTHENTICATE_WEBAUTHN)
}
