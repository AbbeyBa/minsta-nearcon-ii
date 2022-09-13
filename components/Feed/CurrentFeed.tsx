import { useMainFeedThingsController } from '../../controllers/MainFeedThings.controller'
import { ControllerProps } from '../../types/data.type'
import ImageViewer from '../layout/ImageViewer'

const CurrentFeed = (props: ControllerProps) => {
  const { accountId, contractAddress } = props

  const { images, loading } = useMainFeedThingsController({
    accountId,
    contractAddress,
  })

  return <ImageViewer images={images} loading={loading} />
}

export default CurrentFeed
