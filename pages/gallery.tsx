import { CheckCircleIcon, UploadIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Footer from '../components/layout/Footer'
import GoBackButton from '../components/layout/GoBackButton'
import Header from '../components/layout/Header'
import Page from '../components/layout/Page'
import { useCreateThing } from '../modules/3xr/hooks'
import { useWallet } from '../services/providers/NearWalletProvider'

const GalleryPage = () => {
  const { details } = useWallet()
  const router = useRouter()
  const { src, metadata, royalties, loading, handlers, minting } =
    useCreateThing({
      accountId: details?.accountId,
      networkId: details?.network || 'testnet',
    })
  const { progress, isMinting, progressMessage } = minting
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <Page>
      <Header>{!isMinting && <GoBackButton />}</Header>{' '}
      <main className="flex-1 py-1 text-white flex flex-col justify-center items-center">
        <div className="bg-white pb-12 rounded p-4 relative">
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={src}
            className={imageLoading ? 'w-0 h-0' : 'w-48 h-48'}
            crossOrigin="anonymous"
            onLoad={() => {
              setImageLoading(false)
            }}
          ></img>

          {imageLoading && (
            <div className="w-48 h-48 animate-pulse bg-black"></div>
          )}

          <div className="absolute bottom-2 right-4">
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src="/assets/images/3XR-black.png"
              className="h-5 w-5 object-contain"
            />
          </div>
        </div>

        {progress > 0 && (
          <div className="text-white w-full text-center">
            <div className="text-sm">{progressMessage}</div>
            <div className="text-xs">{progress * 100}%</div>
          </div>
        )}
      </main>
      <Footer>
        <div className="text-white px-4 py-2 flex flex-col justify-center items-center">
          <div className="w-5 h-5"></div>
        </div>
        <div className="py-4">
          {progress < 1 && !isMinting && (
            <div
              onClick={handlers.mint}
              className="bg-white text-black rounded-full h-12 w-12 flex items-center justify-center"
            >
              <UploadIcon className="h-5 w-5" />
            </div>
          )}
          {progress === 1 && !isMinting && (
            <div
              onClick={() => router.push('/')}
              className="bg-white text-black rounded-full h-12 w-12 flex items-center justify-center"
            >
              <CheckCircleIcon className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="text-white px-4 py-2 flex flex-col justify-center items-center">
          <div className="w-5 h-5"></div>
        </div>
      </Footer>
    </Page>
  )
}

export default GalleryPage
