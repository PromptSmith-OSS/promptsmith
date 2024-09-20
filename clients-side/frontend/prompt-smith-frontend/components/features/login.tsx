'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

import {login, init} from "@/lib/auth/wrapper";
import {useEffect, useState} from "react";

const Login = () => {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [response, setResponse] = useState({fetching: false, content: null})
  // const config = useConfig()

  useEffect(() => {
    init()
  }, [])


  const onLogin = async () => {
    setResponse({...response, fetching: true})
    try {
      const response = await login({email, password})
      console.log(response)
      setResponse({...response, fetching: false})

      router.push('/dashboard')
    } catch (e) {
      console.error(e)
      window.alert(e)
      setResponse({...response, fetching: false})
    }
  }

  return <div
    className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <Card className="w-full w-sm">
        <CardHeader>
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
            <Label htmlFor="password">Your Management Token</Label>
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
