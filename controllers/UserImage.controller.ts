import { generateFromString } from 'generate-avatar'
import { useEffect, useState } from 'react'

const useUserImageController = ({ account }: { account: string }) => {
  const [userImage, setUserImage] = useState('')

  useEffect(() => {
    setUserImage(`data:image/svg+xml;utf8,${generateFromString(account)}`)
  }, [account])

  return { userImage }
}

export { useUserImageController }
