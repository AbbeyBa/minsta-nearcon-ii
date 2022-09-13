import { gql, useQuery } from '@apollo/client'
import { isUndefined } from 'lodash'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import GoBackButton from '../components/layout/GoBackButton'
import Header from '../components/layout/Header'
import { useApp } from '../services/providers/AppContext'

const FETCH_LEADERBOARD = gql`
  query FetchLeaderboard($contractAddress: String) @cached {
    token(where: { storeId: { _eq: $contractAddress } }) {
      ownerId
    }
  }
`

const LoadingLeaderboard = () => {
  const getArray = (n: number) => {
    return Array.from({ length: n }, (_, i) => i)
  }

  return (
    <div className="container flex flex-row flex-wrap gap-1 sm:gap-4 lg:gap-8 justify-center">
      {getArray(7).map((i) => (
        <div
          key={i}
          className="rounded flex w-full border-solid border-2 border-white"
        >
          <div className="flex p-4 justify-between w-full items-center">
            <div className="w-2/3 h-8 rounded animate-pulse bg-gray-100" />
            <div className="bg-gray-100 h-14 w-14 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

const LeaderboardPage = () => {
  const { contractAddress } = useApp()

  const { data, loading } = useQuery(FETCH_LEADERBOARD, {
    variables: {
      contractAddress: contractAddress,
    },
  })

  const leaderboard = useMemo(() => {
    if (loading) return []
    const accounts = data.token

    const leaderboardResult = accounts.reduce(
      (acc: Record<string, number>, token: any) => {
        const { ownerId } = token

        const notExist = isUndefined(acc[ownerId]) || isNaN(acc[ownerId])

        if (notExist) {
          acc[ownerId] = 1
        } else {
          acc[ownerId] = acc[ownerId] + 1
        }

        return acc
      },
      {}
    )

    const resultArray = Object.keys(leaderboardResult)
      .map((key) => {
        return {
          count: leaderboardResult[key],
          account: key,
        }
      })
      .sort((a, b) => {
        return b.count - a.count
      })

    return resultArray
  }, [data])

  return (
    <div className="bg-black min-h-screen">
      <Header>
        <GoBackButton />
        <h1 className="text-lg font-bold">Minsta. Leaderboard</h1>
        <div className='w-5 h-5'></div>
      </Header>
      <main
        className="flex justify-center no-scrollbar"
        style={{ padding: '68px 0' }}
      >
        <div className="flex justify-center w-full">
          <div className="flex flex-col w-full px-4 gap-4 max-w-xl">
            {loading ? (
              <LoadingLeaderboard />
            ) : (
              leaderboard?.map((element) => {
                return (
                  <div
                    key={element.account}
                    className="rounded text-white flex w-full border-solid border-2 border-white"
                  >
                    <div className="flex p-4 justify-between w-full items-center">
                      <div className="font-bold text-md truncate w-2/3">
                        {element.account}
                      </div>
                      <div className="font-extrabold bg-white text-black h-14 w-14 flex items-center justify-center rounded-full">
                        {element.count}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default LeaderboardPage
