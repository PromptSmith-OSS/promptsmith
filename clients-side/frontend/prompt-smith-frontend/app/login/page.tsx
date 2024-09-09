export default function LoginPage() {
  return (
    <>
      <form action="/api/simple-login" method="POST">
        <div>
          <label htmlFor="bearerToken">Token</label>
          <input id="bearerToken" name="bearerToken" type="password"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  )
}
