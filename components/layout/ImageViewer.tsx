import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Image as ImageType,
  ReactImageCarouselViewer,
} from 'react-image-carousel-viewer'
import { BUTTON_CLASS } from '../../constants/classes'
import { useWallet } from '../../services/providers/NearWalletProvider'
import LoadingImages from './LoadingImages'

const ImageViewer = ({
  images,
  loading,
}: {
  images: ImageType[]
  loading: boolean
}) => {
  const { details, loading: loadingWallet } = useWallet()

  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (loading || loadingWallet) return <LoadingImages />

  return (
    <div className="container flex flex-wrap gap-1 sm:gap-4 lg:gap-8 justify-center m-auto">
      {images.length
        ? images.map((image, index: number) => (
            <div
              className="relative w-24 h-24 sm:w-48 sm:h-48 lg:w-72 lg:h-72 cursor-pointer"
              key={`${image.id}-${index}`}
              onClick={() => {
                setIndex(index)
                setIsViewerOpen(true)
              }}
            >
              <Image
                layout="fill"
                objectFit="cover"
                src={image.src}
                alt={image.id}
              />
            </div>
          ))
        : null}

      {images?.length ? (
        <ReactImageCarouselViewer
          open={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          images={images}
          startIndex={index}
          disableScroll
          extraTopElement={
            <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
              <Link
                key={`${images[index].id}-${index}`}
                href={`${
                  details.network === 'testnet'
                    ? `https://testnet.mintbase.io/thing/${images[index].id}`
                    : `https://mintbase.io/thing/${images[index].id}`
                }`}
                passHref
              >
                <a
                  className={`${BUTTON_CLASS} bg-black hover:bg-white border-white border hover:text-black text-white`}
                >
                  View on Mintbase
                </a>
              </Link>
              <Link
                key={images[index].id}
                href={`${
                  details.network === 'testnet'
                    ? `https://testnet.3xr.space/thing/${images[index].id}`
                    : `https://3xr.space/thing/${images[index].id}`
                }`}
                passHref
              >
                <a
                  className={`${BUTTON_CLASS} bg-white hover:bg-black hover:border hover:border-white hover:text-white text-black`}
                >
                  View on 3XR
                </a>
              </Link>
            </div>
          }
        />
      ) : null}
    </div>
  )
}

export default ImageViewer
