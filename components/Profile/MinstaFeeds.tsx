import { TrashIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { ReactSimpleModal } from 'react-awesome-simple-modal'
import { BUTTON_CLASS } from '../../constants/classes'
import { useMinstaFeedsListController } from '../../controllers/MinstaFeedsList.controller'
import { useWallet } from '../../services/providers/NearWalletProvider'

const MinstaFeeds = ({
  accountId,
  proxyAddress,
  store,
}: {
  accountId: string
  proxyAddress: string
  store: string
}) => {
  const [showRemoveMessage, setShowRemoveMessage] = useState(false)
  const [clickedFeed, setClickedFeed] = useState('')

  const { wallet, details } = useWallet()

  const { feeds, loading } = useMinstaFeedsListController({
    accountId,
    proxyAddress,
  })

  const removeProxyMinter = () => {
    const mbSuffix =
      details.network === 'testnet' ? 'mintspace2.testnet' : 'mintbase1.near'

    wallet?.signAndSendTransaction({
      signerId: accountId,
      receiverId: `${clickedFeed}.${mbSuffix}`,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'revoke_minter',
            args: {
              account_id: proxyAddress,
            },
            gas: '200000000000000',
            deposit: '1',
          },
        },
      ],
    })
  }

  if (!loading && !feeds?.length) return null

  return (
    <>
      <div className="pb-12 flex gap-1 sm:gap-4 flex-wrap px-4 items-center justify-center">
        {feeds.map((feed) => {
          const contract = feed.split('.').shift()
          const splitLink = window.location.host.split('.')
          const baseLink =
            splitLink.length > 2
              ? `${splitLink[1]}.${splitLink[2]}`
              : splitLink.length > 1
              ? splitLink[1]
              : splitLink[0]

          return (
            <a href={`http://${contract}.${baseLink}`} key={feed}>
              <div className="text-white text-xs py-1 px-2 sm:py-3 sm:px-4 border border-white rounded flex gap-2">
                {feed}
                <div
                  className="w-4 h-4 relative text-red-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setClickedFeed(feed)
                    setShowRemoveMessage(!showRemoveMessage)
                  }}
                >
                  <TrashIcon />
                </div>
              </div>
            </a>
          )
        })}
      </div>
      <ReactSimpleModal
        open={showRemoveMessage}
        onClose={() => setShowRemoveMessage(!showRemoveMessage)}
      >
        <div className="p-8 text-center bg-neutral-900 rounded w-64 sm:w-96 m-auto">
          <div className="text-white">
            Are you sure you want to remove this minsta feed?
          </div>
          <div className="text-red-400 text-sm mt-2 mb-4 font-bold">
            You cannot revert this action.
          </div>

          <button
            className={`${BUTTON_CLASS} bg-black hover:bg-white border-white border hover:text-black text-white`}
            onClick={() => removeProxyMinter()}
          >
            Continue
          </button>
        </div>
      </ReactSimpleModal>
    </>
  )
}

export default MinstaFeeds
