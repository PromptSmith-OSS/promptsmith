import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import LoginForm from "@/components/features/login-form";


const Login = () => {


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
        <LoginForm/>
      </Card>
    </main>
  </div>
}

export default Login
