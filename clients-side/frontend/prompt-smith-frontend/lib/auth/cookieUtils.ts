import {ORG_COOKIE_NAME, PROJECT_COOKIE_NAME, SESSION_AGE} from "@/lib/constants"; // shared configuation file between frontend and backend


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

const setCookie = (name: string, value: string, seconds: number = SESSION_AGE) => {
  const date = new Date()
  date.setTime(date.getTime() + seconds)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}

export const setCookieProjectUUID = (uuid: string) => {
  setCookie(PROJECT_COOKIE_NAME, uuid)
}

export const setCookieOrgUUID = (uuid: string) => {
  setCookie(ORG_COOKIE_NAME, uuid)
}


export function getCSRFToken() {
  return getCookie('csrftoken')
}
