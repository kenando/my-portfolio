import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import { signInWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../../../types/auth'
import { useRouter } from 'next/router'
import Link from "next/link";
import {FirebaseError} from "@firebase/app";

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
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      await router.push('/top')
    } catch(e){
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case 'auth/invalid-email':
            alert('メールアドレスが不正です。')
            break
          case 'auth/user-disabled':
            alert('アカウントが無効です。')
            break
          case 'auth/user-not-found':
            alert('アカウントが見つかりませんでした。')
            break
          case 'auth/wrong-password':
            alert('パスワードが間違っています。')
            break
          default:
            alert('ログインに失敗しました。')
        }
      } else {
        alert('ログインに失敗しました。')
      }
    }

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
