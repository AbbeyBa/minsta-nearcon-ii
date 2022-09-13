import { gql, useQuery } from '@apollo/client'
import { MetadataField } from 'mintbase'
import { Contract } from 'near-api-js'
import { useState, useEffect } from 'react'
import { uuid as uuidv4 } from 'uuidv4'
import { useWallet } from '../../services/providers/NearWalletProvider'

const MAINNET_3XR_SHORT_URL = `https://short.3xr.space`
const TESTNET_3XR_SHORT_URL = `https://testnet.short.3xr.space`

// 1. Create metadata
// 2. Create royalty rules
// 3. Upload cover image
// 4. Upload metadata
// 5. Mint

const FETCH_THINGS_FOR_GALLERY = gql`
  query FetchMintedThings($accountId: String!) {
    token(
      where: {
        storeId: { _eq: "minsta.mintbase1.near" }
        royaltys: { account: { _eq: $accountId }, percent: { _eq: 10000 } }
        burnedAt: { _is_null: true }
      }
      order_by: { createdAt: desc }
      limit: 12
    ) {
      id
      createdAt
      royaltys {
        account
      }
      thing {
        id
        metadata {
          media
          title
          description
        }
      }
    }
  }
`

const useCreateThing = ({
  accountId,
  networkId,
}: {
  accountId?: string
  networkId?: 'mainnet' | 'testnet' | string
}) => {
  const { wallet, details, isConnected } = useWallet()

  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [isMinting, setIsMinting] = useState(false)

  const { data, loading } = useQuery(FETCH_THINGS_FOR_GALLERY, {
    variables: {
      accountId: accountId,
    },
  })

  const [template, setTemplate] = useState(
    'vaWawvhvChzRNkQVh7rBtSY118yrGzY7dzWO5-ehjrg:hellovirtualworld.mintbase1.near'
  )

  const [src, setSrc] = useState('')
  const [metadata, setMetadata] = useState<any>(undefined)
  const [royalties, setRoyalties] = useState<any>(undefined)

  useEffect(() => {
    if (!data) return

    const imageArray = data.token.map((token: any) => {
      const { thing } = token
      const { metadata } = thing
      const { media } = metadata

      return media
    })

    const thingIdArray = data.token.map((token: any) => {
      const { thing } = token
      const { id } = thing

      return id
    })

    // reduce of all accounts royalty
    let royaltyArray = data.token.reduce((acc: any, token: any) => {
      const { royaltys } = token
      const accounts = royaltys.map((royalty: any) => {
        return royalty.account
      })

      return [...acc, ...accounts]
    }, [])

    // tokens + template royalties
    royaltyArray = [...royaltyArray, '3xr.near', 'gbehnamg.near']

    const uniqueRoyaltyArray = Array.from(new Set(royaltyArray))

    const total = 10000
    const equalAmountPerAccount = Number(
      (total / uniqueRoyaltyArray.length).toFixed(0)
    )

    const percentPerAccount = uniqueRoyaltyArray.reduce(
      (acc: any, account: any) => {
        return {
          ...acc,
          [account]: equalAmountPerAccount,
        }
      },
      []
    )

    // check if percent per account is equal to total
    // @ts-ignore
    const totalPercent = Object.values(percentPerAccount).reduce(
      (acc: any, percent: any) => {
        return acc + percent
      }
    )

    // @ts-ignore
    percentPerAccount[accountId] =
      // @ts-ignore
      percentPerAccount[accountId] + (total - totalPercent)

    setRoyalties(percentPerAccount)

    setSrc(imageArray.join(','))

    const uniqueId = uuidv4()
    const shortUrl =
      networkId === 'mainnet'
        ? `${MAINNET_3XR_SHORT_URL}/${uniqueId}`
        : `${TESTNET_3XR_SHORT_URL}/${uniqueId}`

    setMetadata({
      title: `Auto-generated 3XR custom gallery for ${accountId}`,
      description: '-',
      [MetadataField.External_url]: shortUrl,
      extra: [
        {
          trait_type: 'gallery_nfts',
          display_type: 'NFT Gallery',
          value: thingIdArray,
        },
        {
          trait_type: 'external_space',
          display_type: 'External Space',
          value: template,
        },
        {
          trait_type: 'space_colors',
          display_type: 'Colors',
          value: {
            skyColor: '#ffffff',
          },
        },
        {
          trait_type: 'gated_by',
          display_type: 'Gated By',
          value: [],
        },
        {
          trait_type: 'website',
          display_type: 'Website',
          value: shortUrl,
        },
        {
          trait_type: uniqueId,
          display_type: 'Short URL',
          value: uniqueId,
        },
      ],
    })
  }, [data])

  const handleMint = async () => {
    if (!isConnected) return

    setIsMinting(true)
    setProgress(0.2)
    setProgressMessage('Minting started...')

    const coverImageResponse = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataSrc: `https://create.3xr.space/api/merge-images?images=${src}`,
      }),
    })

    const coverImageResult = await coverImageResponse.json()

    const metadataResponse = await fetch('/api/upload-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...metadata,
          media_hash: coverImageResult.id,
          media: `https://arweave.net/${coverImageResult.id}`,
        },
      }),
    })

    const metadataResult = await metadataResponse.json()

    setProgressMessage('Uploading image to Arweave...')
    setProgress(0.4)

    setProgressMessage(`Upload completed.`)
    // sleep for a half a second
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setProgress(0.8)
    setProgressMessage(`Minting gallery...`)

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
                reference: metadataResult.id,
                extra: 'custom-3xr-gallery',
              },
              num_to_mint: 1,
              royalty_args: {
                split_between: {
                  ...royalties,
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
    setProgress(1)
    setIsMinting(false)

    try {
      // DO2EARN INTEGRATION
      await fetch('https://do2earn.3xr.space/api/reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Minsta <> 3XR Reward',
          description: 'Reward for minting a 3XR gallery at Minsta',
          imageType: '2',
          earnId: 'mint-minsta-3xr-gallery',
          transactionHash: transactionHash,
          methodName: 'mint',
        }),
      })

      setProgress(1)
      setIsMinting(false)
    } catch (error) {
      setProgress(1)
      setIsMinting(false)
    }
  }

  return {
    src: `https://create.3xr.space/api/merge-images?images=${src}`,
    metadata,
    royalties,
    loading,
    minting: {
      progress,
      isMinting,
      progressMessage,
    },
    handlers: {
      mint: handleMint,
    },
  }
}

export { useCreateThing }
