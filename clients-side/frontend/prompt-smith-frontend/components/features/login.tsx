'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";

import {init, login} from "@/lib/auth/authAPIWrapper";
import {useEffect, useState} from "react";
import {setCookieProjectUUID} from "@/lib/auth/cookieUtils";

import {Project, UserResp} from "@/lib/api/interfaces";
import {resourceFetcher} from "@/lib/api/fetcher";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {LoadingButton} from "@/components/ui-ext/loading-button";


const getProjects = async (): Promise<Project[]> => {
  try {
    const data = await resourceFetcher('project')
    return data.items
  } catch (e) {
    console.error(e)
    return []
  }
}

const formSchema = z.object({
  email: z.string().email().min(5, {
    message: "Email must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const Login = () => {


  const router = useRouter()

  const [userResp, setUserResp] = useState<UserResp | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {email, password} = values
    try {
      setLoading(true)
      const response = await login({email, password})

      setUserResp({...response})
    } catch (e) {
      console.error(e)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setError(e.message as string)
      alert('Login failed') // todo display error message properly
    }

    // fetch user project, this should not block user login
    const projects = await getProjects()
    if (projects.length > 0) {
      setCookieProjectUUID(projects[0].uuid)
    } else {
      console.error('No projects found')
    }
    setLoading(false)
    router.push('/prompt')
  }


  useEffect(() => {
    setError(null)
    init()
  }, [])


  useEffect(() => {
    if (userResp && !userResp?.meta.is_authenticated) {
      console.error('User not authenticated', error)
      alert('User authenticated failed, please try again')
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="" {...field} />
                    </FormControl>
                    {/*<FormDescription>*/}
                    {/*  Email*/}
                    {/*</FormDescription>*/}
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field} />
                    </FormControl>
                    {/*<FormDescription>*/}
                    {/*  Password*/}
                    {/*</FormDescription>*/}
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <LoadingButton className="w-full h-9" loading={loading} disabled={loading}>
                {
                  loading ? 'Signing... in' : 'Sign in'
                }
              </LoadingButton>
            </CardFooter>
          </form>
        </Form>
      </Card>

    </main>
  </div>
}

export default Login
