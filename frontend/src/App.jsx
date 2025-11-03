import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

function App() {
  return (
    <>
     <h1>Welcome to the App</h1>
     <SignedOut>
     <SignInButton mode="modal"/>
     </SignedOut>
     <SignedIn>
      <SignedOut/>
     </SignedIn>
     <UserButton/>
    </>
  )
}

export default App
