import Login from "@/components/features/login";
import {IS_IN_DEMO_MODE} from "@/lib/constants";


function LoginForm() {
  return (
    <>

      <Login/>
      {
        IS_IN_DEMO_MODE && (
          <>
            DEMO</>
        )
      }
    </>
  )
}

export default LoginForm
