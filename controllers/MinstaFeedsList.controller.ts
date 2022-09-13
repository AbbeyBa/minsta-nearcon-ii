import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { CHECK_ONWER_MINSTAS } from '../queries/stores.graphql'

const useMinstaFeedsListController = ({
  accountId,
  proxyAddress,
}: {
  accountId: string
  proxyAddress: string
}) => {
  const [feeds, setFeeds] = useState<string[]>([])

  const { data, loading } = useQuery<any>(CHECK_ONWER_MINSTAS, {
    variables: {
      accountId,
      proxyAddress,
    },
    onCompleted: (data) => {
      if (!data) return

      setFeeds(
        data.mb_store_minters.map((store: any) => store.nft_contracts.name)
      )
    },
  })

  return { feeds, loading }
}

export { useMinstaFeedsListController }
