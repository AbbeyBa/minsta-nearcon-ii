import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { Image } from 'react-image-carousel-viewer'
import { FETCH_USER_CREATED, FETCH_USER_OWNED } from '../queries/things.graphql'
import { ControllerProps, TokenData } from '../types/data.type'

const useUserOwnedThingsController = (props: ControllerProps) => {
  const { accountId, contractAddress } = props
  const [images, setImages] = useState<Image[]>([])

  const { data, loading } = useQuery<TokenData>(FETCH_USER_OWNED, {
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

const useUserMintedThingsController = ({
  accountId,
  contractAddress,
}: {
  accountId: string
  contractAddress: string
}) => {
  const [images, setImages] = useState<Image[]>([])

  const { data, loading } = useQuery<TokenData>(FETCH_USER_CREATED, {
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

export { useUserOwnedThingsController, useUserMintedThingsController }
