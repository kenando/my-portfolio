import { IoLogOutOutline } from 'react-icons/io5'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../types/auth'

const Header = () => {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.push('/signin')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }
  return (
    <div className="Header-Box">
      <h3>株式会社メンヘラテクノロジーコーディングテスト</h3>
      <IoLogOutOutline size={30} onClick={handleLogout} />
    </div>
  )
}

export default Header
