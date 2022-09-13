import { useUserMintedThingsController } from '../../controllers/UserThings.controller'
import { ControllerProps } from '../../types/data.type'
import ImageViewer from '../layout/ImageViewer'

const MintedMoments = (props: ControllerProps) => {
  const { accountId, contractAddress } = props
  const { images: mintedImages, loading: mintedLoading } =
    useUserMintedThingsController({
      accountId,
      contractAddress,
    })

  return <ImageViewer images={mintedImages} loading={mintedLoading} />
}

export default MintedMoments
