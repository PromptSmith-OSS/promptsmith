'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

import {login, init} from "@/lib/auth/authAPIWrapper";
import {useEffect, useState} from "react";
import {setCookieProjectUUID} from "@/lib/auth/cookieUtils";

import {Project, UserResp} from "@/lib/api/interfaces";
import {resourceFetcher} from "@/lib/api/fetcher";


const getProjects = async (): Promise<Project[]> => {
  try {
    const data = await resourceFetcher('project')
    return data.items
  } catch (e) {
    console.error(e)
    return []
  }
}

const Login = () => {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userResp, setUserResp] = useState<UserResp | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    init()
  }, [])


  const onLogin = async () => {
    try {
      const response = await login({email, password})
      setUserResp({...response})
    } catch (e) {
      console.error(e)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setError(e.message as string)
      alert('Login failed') // todo display error message properly
    }

    // fetch user project
    const projects = await getProjects()
    if (projects.length > 0) {
      setCookieProjectUUID(projects[0].uuid)
    } else {
      console.error('No projects found')
    }
    router.push('/dashboard')
  }

  useEffect(() => {
    if (!userResp?.meta.is_authenticated) {
      console.error('User not authenticated')
      setError('User not authenticated, please try again')
    }
  }, [userResp])


  return <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <Card className="w-full min-w-sm">
        <CardHeader className={'min-w-sm'}>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Login to your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" required onChange={
              (e) => {
                setEmail(e.target.value)
              }
            }/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" required onChange={
              (e) => {
                setPassword(e.target.value)
              }
            }/>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onLogin}>Sign in</Button>
        </CardFooter>
      </Card>
    </main>
  </div>
}

export default Login
