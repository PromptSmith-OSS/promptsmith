'use client'
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Project, UserResp} from "@/lib/api/interfaces";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {init, login} from "@/lib/auth/authAPIWrapper";
import {setCookieProjectUUID} from "@/lib/auth/cookieUtils";
import {CardContent, CardFooter} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui-ext/loading-button";
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

const formSchema = z.object({
  email: z.string().email().min(5, {
    message: "Email must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

const LoginForm = () => {
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
    if (projects?.length) {
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
    if (userResp && !userResp?.meta?.is_authenticated) {
      console.error('User not authenticated', error)
      alert('User authenticated failed, please try again')
    }
  }, [userResp])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <CardContent className="grid">
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="demo@demo.promptsmith.dev"
                    {...field}
                  />
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
          <LoadingButton className="w-full h-9" loading={loading} disabled={loading || !!error}>
            {
              loading ? 'Signing... in' : 'Sign in'
            }
          </LoadingButton>
          {/*<Button variant="outline" className="w-full">*/}
          {/*  Login with Google*/}
          {/*</Button>*/}
        </CardFooter>
      </form>
    </Form>
  )
}

export default LoginForm;
