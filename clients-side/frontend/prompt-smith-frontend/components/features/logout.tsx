'use client'
import * as React from "react";
import {logout} from "@/lib/auth/authAPIWrapper";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";

const Logout = () => {

  const router = useRouter()

  const onLogout = async () => {
    try {
      await logout()
    } catch (e) {
      console.error(e)
    }
    router.push('/')

  }
  return <>
    <DropdownMenuItem onClick={onLogout} className="align-middle justify-center">
      <Button onClick={onLogout}>Logout</Button>
    </DropdownMenuItem>
  </>
}


export default Logout
