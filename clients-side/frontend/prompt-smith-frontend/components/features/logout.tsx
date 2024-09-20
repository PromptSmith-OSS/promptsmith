'use client'
import * as React from "react";
import {logout} from "@/lib/auth/wrapper";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const Logout = () => {

  const router = useRouter()

  const onLogout = async () => {
    await logout()
    router.push('/')

  }
  return <>
    <Button onClick={onLogout}>Logout</Button>
  </>
}


export default Logout
