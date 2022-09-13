import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { Image } from 'react-image-carousel-viewer'
import { FETCH_MINTED_THINGS } from '../queries/things.graphql'
import { ControllerProps, TokenData } from '../types/data.type'

const useMainFeedThingsController = (props: ControllerProps) => {
  const { accountId, contractAddress } = props
  const [images, setImages] = useState<Image[]>([])

  const { data, loading } = useQuery<TokenData>(FETCH_MINTED_THINGS, {
    variables: {
      accountId,
      contractAddress,
    },
    onCompleted: (data) => {
      if (!data) return

      setImages(
        data.token.map((token) => {
          return {
            src: token?.thing?.metadata?.media,
            description: token?.thing?.metadata?.title,
            id: token?.thing?.id,
          }
        })
      )
    },
  })

  return {
    images,
    loading,
  }
}

export { useMainFeedThingsController }
