import {
  CheckCircleIcon,
  DownloadIcon,
  TrashIcon,
  UploadIcon,
} from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../components/layout/Footer'
import GoBackButton from '../components/layout/GoBackButton'
import Header from '../components/layout/Header'
import Page from '../components/layout/Page'
import { useDownloadImage, useFilters } from '../modules/filters/hooks'
import { useApp } from '../services/providers/AppContext'
import { useWallet } from '../services/providers/NearWalletProvider'
// import cg from '../modules/filters'

const NewMintPage = () => {
  const { wallet, details, loading, isConnected } = useWallet()
  const router = useRouter()

  const { dataUrl } = useApp()

  if (!loading && !isConnected) router.push('/')

  const [dataUrlClone, setDataUrlClone] = useState<string | undefined>(
    undefined
  )
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [isMinting, setIsMinting] = useState(false)

  const [selectedFilter, setSelectedFilter] = useFilters({
    selectors: '#preview-image',
  })

  const { imageRef, download, getDataUrl } = useDownloadImage()

  const handleMint = async () => {
    if (!isConnected) return

    setIsMinting(true)
    setProgress(0.2)
    setProgressMessage(`Minting started...`)

    await router.replace('/mint', undefined, { shallow: true })

    const dataUri = await getDataUrl({ quality: 0.5 })

    setProgressMessage('Uploading image to Arweave...')

    // fetch post
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataUri: dataUri,
      }),
    })
    setProgress(0.4)

    const json = await response.json()

    setProgressMessage(`Upload completed.`)

    setProgress(0.6)
    // sleep for a half a second
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setProgress(0.8)
    setProgressMessage(`Minting photo...`)

    const result = await wallet?.signAndSendTransaction({
      signerId: details.accountId,
      receiverId: details.proxyAddress,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'mint',
            args: {
              owner_id: details.accountId,
              metadata: {
                reference: json.id,
                extra: null,
              },
              num_to_mint: 1,
              royalty_args: {
                split_between: {
                  [details.accountId as string]: 10000,
                },
                percentage: 1000,
              },
              split_owners: null,
              nft_contract_id: details.nftContractAddress,
            },
            gas: '200000000000000',
            deposit: '0',
          },
        },
      ],
    })

    const transactionHash = result?.transaction_outcome?.id

    setProgressMessage(`Mint completed.`)

    try {
      // DO2EARN INTEGRATION
      // await fetch('https://do2earn.3xr.space/api/reward', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title: 'Minsta Reward',
      //     description: 'Reward for minting at Minsta',
      //     imageType: '3',
      //     earnId: 'mint-minsta',
      //     transactionHash: transactionHash,
      //     methodName: 'mint',
      //   }),
      // })

      setProgress(1)
      setIsMinting(false)
    } catch (error) {
      setProgress(1)
      setIsMinting(false)
    }
  }

  useEffect(() => {
    if (!router.isReady || !dataUrl) return
    setDataUrlClone(dataUrl as string)
  }, [dataUrl])

  if (!router.isReady) return null

  return (
    <Page>
      <Header>{!isMinting && <GoBackButton goPreviousPage />}</Header>
      <main className="flex-1 py-1 text-white flex flex-col justify-center items-center">
        <div className="bg-white pb-12 rounded">
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img
            id="preview-image"
            className="w-48 h-48 m-4"
            src={dataUrlClone}
            data-filter={selectedFilter}
            alt={selectedFilter.toUpperCase()}
            ref={imageRef}
          ></img>
        </div>

        {progress > 0 && (
          <div className="text-white w-full text-center">
            <div className="text-sm">{progressMessage}</div>
            <div className="text-xs">{progress * 100}%</div>
          </div>
        )}

        {/* {cg.filterNames.length > 0 && (
          <div className="no-scrollbar flex w-full overflow-x-auto gap-4 px-4">
            {cg.filterNames.map((filterName, index) => {
              return (
                <div
                  role={'button'}
                  key={filterName}
                  onClick={() => setSelectedFilter(filterName)}
                  onKeyPress={() => setSelectedFilter(filterName)}
                  className={`snap-center border-2 p-2 w-24 text-white ${
                    selectedFilter === filterName ? 'ring-1 ring-red-400' : ''
                  }`}
                >
                  <p>{filterName}</p>
                </div>
              )
            })}
          </div>
        )} */}
      </main>
      {selectedFilter && (
        <div
          className="absolute right-4-safe top-4-safe z-20 text-white"
          onClick={() => {
            setSelectedFilter('')
          }}
        >
          <TrashIcon className="w-5 h-5" />
        </div>
      )}
      <Footer>
        <div className="text-white px-4 py-2 flex flex-col justify-center items-center">
          <div className="w-5 h-5"></div>
        </div>
        <div className="py-4">
          {progress < 1 && !isMinting && (
            <div
              onClick={handleMint}
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
        <div
          className="text-white px-4 py-4 flex flex-col justify-center items-center"
          onClick={() => {
            download()
          }}
        >
          <DownloadIcon className="w-5 h-5" />
        </div>
      </Footer>
    </Page>
  )
}

export default NewMintPage
