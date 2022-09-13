import Image from 'next/image'
import { useUserImageController } from '../../controllers/UserImage.controller'

const UserImage = ({ account }: { account: string }) => {
  const { userImage } = useUserImageController({ account })

  return userImage ? (
    <Image
      className="rounded-full"
      src={userImage}
      layout="fill"
      objectFit="contain"
    />
  ) : null
}

export default UserImage
