import Image from 'next/image'
import { useExploreFeedThingsController } from '../../controllers/ExploreFeedThings.controller'
import { ControllerProps } from '../../types/data.type'

const LoadingImages = () => {
  const getArray = (n: number) => {
    return Array.from({ length: n }, (_, i) => i)
  }

  return (
    <div className="container flex flex-row flex-wrap gap-4 justify-center m-auto">
      {getArray(3).map((index) => (
        <div
          className="bg-gray-100 w-5/6 sm:w-72 h-72 bg-cover bg-center bg-no-repeat animate-pulse"
          key={index}
        />
      ))}
    </div>
  )
}

const ExploreFeed = (props: ControllerProps) => {
  const { accountId, contractAddress } = props

  const { images, loading } = useExploreFeedThingsController({
    accountId,
    contractAddress,
  })

  if (loading) return <LoadingImages />
  return (
    <>
      {images.length
        ? images.map((image, index) => {
            const contract = image.storeId.split('.').shift()
            const splitLink = window.location.host.split('.')
            const baseLink =
              splitLink.length > 2
                ? `${splitLink[1]}.${splitLink[2]}`
                : splitLink.length > 1
                ? splitLink[1]
                : splitLink[0]

            return (
              <a
                href={`http://${contract}.${baseLink}`}
                key={`${image.id}-${index}-${image.storeId}`}
              >
                <p className="text-xs font-bold px-8 mb-1">{contract}</p>
                <div className="relative w-5/6 sm:w-72 h-72 cursor-pointer m-auto mb-4">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={image.src}
                    alt={image.id}
                  />
                </div>
              </a>
            )
          })
        : null}
    </>
  )
}

export default ExploreFeed
