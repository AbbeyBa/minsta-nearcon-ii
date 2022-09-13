import { useUserOwnedThingsController } from '../../controllers/UserThings.controller'
import { ControllerProps } from '../../types/data.type'
import ImageViewer from '../layout/ImageViewer'

const OwnedMoments = (props: ControllerProps) => {
  const { accountId, contractAddress } = props
  const { images: mintedImages, loading: mintedLoading } =
    useUserOwnedThingsController({
      accountId,
      contractAddress,
    })

  return <ImageViewer images={mintedImages} loading={mintedLoading} />
}

export default OwnedMoments
