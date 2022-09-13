import { useRouter } from 'next/router'
import { useState } from 'react'
import { useInterval, useWindowSize } from 'usehooks-ts'

import Camera from '../../modules/camera'
import { useCamera } from '../../modules/camera/hook'
import Page from '../layout/Page'

import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { useApp } from '../../services/providers/AppContext'
import Footer from '../layout/Footer'
import GoBackButton from '../layout/GoBackButton'
import Header from '../layout/Header'

const NewNewCamera = () => {
  const { width, height } = useWindowSize()
  const [latestPicture, setLatestPicture] = useState<string | null>(null)
  const [showBlinkScreen, setShowBlinkScreen] = useState<boolean>(false)
  const router = useRouter()
  const { refs, handlers, state } = useCamera({})
  const { setDataUrl } = useApp()

  const toggleBink = () => setShowBlinkScreen(!showBlinkScreen)

  useInterval(
    () => {
      toggleBink()
    },
    showBlinkScreen ? 150 : null
  )

  const loadingScreenSize = width === 0 || height === 0

  if (loadingScreenSize) return null

  return (
    <Page>
      <Header>
        <GoBackButton />
        {/* {latestPicture && (
          <div className="bg-white pb-2 rounded-sm absolute right-4-safe top-4-safe">
            eslint-disable-next-line @next/next/no-img-element
            <img
              className="object-contain w-8 h-8 m-1"
              alt="last-pic"
              src={latestPicture as string}
              onClick={() => {
                setDataUrl(latestPicture)
                router.push('/mint')
              }}
            />
          </div>
        )} */}
      </Header>
      <main className="w-full flex items-center justify-center h-screen">
        <div className="w-11/12 h-11/12 sm:w-96 sm:h-96">
          <Camera
            aspectRatio={1 / 1}
            refs={{
              player: refs.playerRef,
              canvas: refs.canvasRef,
              container: refs.containerRef,
            }}
            mirrored={state?.currentFacingMode === 'user' ? true : false}
          />
        </div>
      </main>
      {showBlinkScreen && (
        <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col justify-center items-center bg-black"></div>
      )}
      <Footer>
        <div className="px-4 py-4 w-5 h-5">
          {state.numberOfCameras > 1 && (
            <div
              className="text-white"
              onClick={() => {
                handlers.switchCamera()
              }}
            >
              <SwitchHorizontalIcon className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="p-4">
          <div
            className="bg-white rounded-full h-12 w-12 flex justify-center items-center"
            onClick={() => {
              const imageSrc = handlers.takePhoto()
              setDataUrl(imageSrc)
              toggleBink()
              router.push('/mint')
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white border-black border-2"></div>
          </div>
        </div>
        <div className="text-white px-4 py-4 flex flex-col justify-center items-center w-5 h-5"></div>
      </Footer>
    </Page>
  )
}

export default NewNewCamera
