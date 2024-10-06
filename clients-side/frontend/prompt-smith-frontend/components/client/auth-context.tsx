import {createContext, ReactNode, useEffect, useState} from 'react'
import {getAuth, init as getConfig} from '@/lib/auth/authAPIWrapper'
import {Loading, LoadingError} from "@/components/custom-ui/loading";

export const AuthContext = createContext<{ auth: boolean | undefined, config: { status?: number } | undefined }
>({
  auth: false,
  config: {}
})

export function AuthContextProvider(props: { children: ReactNode }) {
  const [auth, setAuth] = useState<boolean | undefined>(undefined)
  const [config, setConfig] = useState<{ status?: number } | undefined>(undefined)

  useEffect(() => {
    function onAuthChanged(e: { detail: boolean | undefined }) {
      setAuth(auth => {
          if (typeof auth === 'undefined') {
            console.log('Authentication status loaded')
          } else {
            console.log('Authentication status updated')
          }
          return e.detail
        }
      )
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    document.addEventListener('allauth.auth.change', onAuthChanged)
    getAuth().then(data => setAuth(data)).catch((e) => {
      console.error(e)
      setAuth(false)
    })
    getConfig().then(data => setConfig(data)).catch((e) => {
      console.error(e)
    })
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      document.removeEventListener('allauth.auth.change', onAuthChanged)
    }
  }, [])
  const loading = (typeof auth === 'undefined') || config?.status !== 200
  return (
    <AuthContext.Provider value={{auth, config}}>
      {loading
        ? <Loading/>
        : (auth === false
          ? <LoadingError/>
          : props.children)
      }
    </AuthContext.Provider>
  )
}
