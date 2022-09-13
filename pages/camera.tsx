const Camera = dynamic(() => import('../components/pages/Camera'), {
  ssr: false,
})
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useWallet } from '../services/providers/NearWalletProvider'

const CameraPage = () => {
  const { loading, isConnected } = useWallet()
  const router = useRouter()

  if (!loading && !isConnected) router.push('/')

  return <Camera />
}

export default CameraPage
