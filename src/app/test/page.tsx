import React from 'react'
import {signIn, signUp} from '@/server/users'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Signout from '@/components/auth/Signout'

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div>
      {!session ? <button onClick={signIn}>Sign in</button> : <Signout/>}
      <button onClick={signUp}>Sign up</button>
    </div>
  )
}

export default page