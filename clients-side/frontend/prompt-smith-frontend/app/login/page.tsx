import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"


function LoginForm() {
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card className="w-full max-w-sm">
          <form action="/api/login-through-management-key" method="POST">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your management token to login to your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bearerToken">Your Management Token</Label>
                <Input id="bearerToken" type="password" name="bearerToken" required/>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">Sign in</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
)
}

export default LoginForm
