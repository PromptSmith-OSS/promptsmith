'use client'
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
import CSRFInit from "@/components/client/csrf-init"
import Login from "@/components/features/login";


function LoginForm() {



  return (
    <Login/>
  )
}

export default LoginForm
