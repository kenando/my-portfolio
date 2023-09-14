import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import { signInWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../../../types/auth'
import { useRouter } from 'next/router'
import Link from "next/link";

type FormValues = {
  email: string
  password: string
}

const SignInForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>()
  const router = useRouter()
  const handleSignin = async (data: FormValues) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((res) => {
        router.push('/top')
      })
      .catch((err) => {
        console.log(err.message)
      })
  }
  return (
    <div className="Sign-In-Box">
      <form onSubmit={handleSubmit(handleSignin)}>
        <p className="Sign-In-Title">ログイン</p>
        <label className="Input-Label" htmlFor="email">
          メールアドレス
        </label>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="email" className="Input-Box" {...field} />
          )}
          rules={{ required: 'メールアドレスは必須です。' }}
        />
        <div className="Input-Error-Message">{errors.email?.message}</div>
        <label className="Input-Label" htmlFor="password">
          パスワード
        </label>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="password" className="Input-Box" {...field} />
          )}
          rules={{ required: 'パスワードは必須です。' }}
        />
        <div className="Input-Error-Message">{errors.password?.message}</div>
        <button className="Sign-In-Button" type="submit">
          ログインする
        </button>
        <div className="Link-Reset-Password">
          <Link href="/signup">新規登録はこちらから</Link>
        </div>
      </form>
    </div>
  )
}

export default SignInForm
