import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../../types/auth'
import Header from '@/components/template/header'
import { collection, doc, getDoc } from '@firebase/firestore'
import { DocumentData } from 'firebase/firestore'

const TopPage = () => {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)
  const [userInfo, setUserInfo] = useState<DocumentData | undefined>()
  useEffect(() => {
    const fetchData = async () => {
      if (!loading) {
        // 認証が完了したら
        if (!user) {
          // ユーザーがログインしていない場合、別のページにリダイレクト
          await router.push('/signin') // ログインページへリダイレクト
          return
        }
      }
      const myDocRef = collection(firestore, 'users')
      const myDoc = doc(myDocRef, String(user?.uid))
      const myUser = await getDoc(myDoc)
      const userInfo = myUser.data()
      setUserInfo(userInfo)
    }
    fetchData().catch((error) => {
      // エラーハンドリング
      console.error('fetchData error:', error)
    })
  }, [user, loading, router])

  return (
    <>
      <Header />
      <div>
        {loading || !userInfo ? (
            <div className="Container">
              <h1 className="Hello-Message">
                Loading...
              </h1>
            </div>
        ) : (
          <>
            <div className="Container">
              <h1 className="Hello-Message">
                ようこそ,{userInfo?.username}さん
              </h1>
            </div>
          </>
        )}
      </div>
    </>
  )
}
export default TopPage
