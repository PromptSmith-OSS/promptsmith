import Image from "next/image"
import LoginForm from "@/components/features/login-form";
import {IS_IN_DEMO_MODE} from "@/lib/constants";
import {Card} from "@/components/ui/card";


export function LoginDouble() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter below to login to your account
            </p>
          </div>
          <LoginForm/>

          {
            IS_IN_DEMO_MODE && (
              <Card className="mx-6 p-4 text-left ">
                <p className="">
                  This is a demo instance of PromptSmith.
                </p>
                <ul className="text-sm list-disc mt-2 pl-2">
                  <li>
                    Please be aware that the data you enter will be visible to other users of the instance.
                  </li>
                  <li>
                    Your data will be reset in a certain interval.
                  </li>
                </ul>
                <p className="text-sm mt-2">
                  You can login with the following credentials:
                  <br/>
                  email: admin@localhost.lan
                  <br/>
                  password: AwesomePromptsManagement
                </p>
              </Card>
            )
          }


        </div>
      </div>
      <div className="hidden bg-muted lg:block h-full">
        <Image
          src="https://picsum.photos/seed/picsum/1920/1080?blur"
          alt="Image"
          width="1920"
          height="1080"
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
