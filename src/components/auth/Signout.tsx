'use client'
import { authClient } from '@/lib/auth-client'

const Signout = () => {
  return (
    <button onClick={() => {authClient.signOut()}}>Sign out</button>
  )
}

export default Signout