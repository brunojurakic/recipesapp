'use server'

import {auth} from '@/lib/auth'

export const signIn = async () => {
  await auth.api.signInEmail({
    body: {
      email: 'testmail@gmail.com',
      password: '123hoiih13ippih'
    }
  })
}

export const signUp = async () => {
  await auth.api.signUpEmail({
    body: {
      name: 'test',
      email: 'testmail@gmail.com',
      password: '123hoiih13ippih'
    }
  })
}