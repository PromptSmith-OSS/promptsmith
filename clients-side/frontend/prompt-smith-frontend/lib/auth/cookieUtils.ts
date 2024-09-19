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

export function getCSRFToken() {
  return getCookie('csrftoken')
}
