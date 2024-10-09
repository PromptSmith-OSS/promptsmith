import {redirect} from "next/navigation";
import {disableConsoleLogWhenNotInDevelopment} from "@/lib/utils";


export default function Home() {
  disableConsoleLogWhenNotInDevelopment()
  redirect("/login")
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
