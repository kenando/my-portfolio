import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from '@firebase/auth'
import { FirebaseError } from '@firebase/app'
import { doc, setDoc } from '@firebase/firestore'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {firestore, storage} from "types/auth";
import {auth} from "types/auth";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";

type FormValues = {
  email: string
  password: string
  passwordConfirm: string
  username: string
  icon: File
  birthdate: string
  sex: string
}

const SignUpForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>()
  const [isAgree, setIsAgree] = useState(false)
  const router = useRouter()
  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return 'パスワードは8文字以上である必要があります。'
    }
    return true
  }

  const handleSignUp = async (data: FormValues) => {
    if (!isAgree) {
      alert('利用規約に同意してください')
      return
    }
    if (data.password !== data.passwordConfirm) {
      alert('パスワードが一致しません')
      return
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )
      await sendEmailVerification(userCredential.user)
      const docRef = doc(firestore, 'users', userCredential.user.uid)

      //iconをstorageにアップロード
      const storageRef = ref(storage,`images/${data.icon.name}`)
      await uploadBytes(storageRef, data.icon)
      const url = await getDownloadURL(storageRef)
      const signupData = {
        username: data.username,
        birthdate: data.birthdate,
        sex: data.sex,
        url: url,
      }
      await setDoc(docRef, signupData)
      toast('登録が完了しました。')
      await router.push('/top')
    } catch (e) {
      if (e instanceof FirebaseError) {
        // FirebaseErrorをキャッチして、エラーコードに基づいたエラーメッセージを表示
        switch (e.code) {
          case 'auth/weak-password':
            alert('パスワードが弱すぎます。')
            break
          case 'auth/email-already-in-use':
            alert('このメールアドレスはすでに使用されています。')
            break
          default:
            alert('エラーが発生しました。もう一度お試しください。')
            break
        }
      } else {
        alert('エラーが発生しました。もう一度お試しください。')
      }
    }
  }

  return (
    <div className="Sign-Up-Box">
      <form onSubmit={handleSubmit(handleSignUp)}>
        <p className="Sign-Up-Title">新規登録</p>
        <label className="Input-Label" htmlFor="username">
          ユーザー名
        </label>
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="text" className="Input-Box" {...field} />
          )}
          rules={{ required: 'ユーザー名は必須です。' }}
        />
        <div className="Input-Error-Message">{errors.username?.message}</div>
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
          rules={{
            required: 'パスワードは必須です。',
            validate: validatePassword,
          }}
        />
        <div className="Input-Error-Message">{errors.password?.message}</div>
        <label className="Input-Label" htmlFor="password">
          パスワード(確認用)
        </label>
        <Controller
          name="passwordConfirm"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="password" className="Input-Box" {...field} />
          )}
          rules={{
            required: 'パスワードは必須です。',
            validate: validatePassword,
          }}
        />
        <div className="Input-Error-Message">
          {errors.passwordConfirm?.message}
        </div>
        <label className="Input-Label" htmlFor="icon">
          アイコン
        </label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <input type="file" className="Input-Box"  accept="image/*" onChange={(e) => {
              const selectedFile = e.target.files?.[0]; // Optional chainingを使用
              if (selectedFile) {
                field.onChange(selectedFile);
              }
            }}/>
          )}
          rules={{ required: 'アイコンは必須です。' }}
        />
        <div className="Input-Error-Message">{errors.icon?.message}</div>
        <label className="Input-Label" htmlFor="birthdate">
          誕生日
        </label>
        <Controller
          name="birthdate"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="date" className="Input-Box" {...field} />
          )}
          rules={{ required: '誕生日は必須です。' }}
        />
        <div className="Input-Error-Message">{errors.birthdate?.message}</div>
        <div>
          <label className="Input-Label" htmlFor="sex">
            性別
          </label>
          <Controller
            name="sex"
            control={control}
            rules={{
              required:
                '性別は必須です。(回答したくない場合は未回答を選択してください)',
            }}
            render={({ field }) => (
              <>
                <select className="Gender-Field" id="sex" {...field}>
                  <option value="" disabled selected hidden>
                    性別を選択して下さい
                  </option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">その他</option>
                  <option value="noAnswer">回答しない</option>
                </select>
              </>
            )}
          />
          <div className="Input-Error-Message">{errors.sex?.message}</div>
        </div>
        <fieldset className="Is-Agree-Box">
          <input
            type="checkbox"
            id="is-agree"
            onChange={() => setIsAgree(!isAgree)}
          />
          <label htmlFor="is-agree"> 利用規約に同意する</label>
        </fieldset>
        <a
          className="Link"
          href="https://www.notion.so/457df49475494671807673a0a3346451?pvs=21"
        >
          利用規約はこちらへ
        </a>
        <button className="Sign-Up-Button" type="submit">
          新規登録
        </button>
        <div className="Link">
          <Link href={'/signin'}>ログインはこちら</Link>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
