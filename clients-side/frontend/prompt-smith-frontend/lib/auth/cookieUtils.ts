import configuration from '../../config/configuration.json';


const SESSION_AGE = configuration.session_age
const ORG_COOKIER_NAME = configuration.org_cookie_name
const PROEJCT_COOKIE_NAME = configuration.project_cookie_name

/**
 * https://github.com/pennersr/django-allauth/blob/c031add73ccac4d2f8517037a99d56d2598377f9/examples/react-spa/frontend/src/lib/django.js#L15
 * @param name
 */
function getCookie(name: string) {
  let cookieValue = undefined
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

export const setCookie = (name: string, value: string, seconds: number = SESSION_AGE) => {
  const date = new Date()
  date.setTime(date.getTime() + seconds)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}

export const setProjectUUID = (uuid: string) => {
  setCookie(PROEJCT_COOKIE_NAME, uuid)
}

export const setOrgUUID = (uuid: string) => {
  setCookie(ORG_COOKIER_NAME, uuid)
}


export function getCSRFToken() {
  return getCookie('csrftoken')
}
