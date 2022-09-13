import { DotsHorizontalIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { useState } from 'react'
import GoBackButton from '../../components/layout/GoBackButton'
import Header from '../../components/layout/Header'
import UserImage from '../../components/layout/UserImage'
import MinstaFeeds from '../../components/Profile/MinstaFeeds'
import MintedMoments from '../../components/Profile/MintedMoments'
import OwnedMoments from '../../components/Profile/OwnedMoments'
import { useApp } from '../../services/providers/AppContext'
import { useWallet } from '../../services/providers/NearWalletProvider'

const AccountPage = () => {
  const {
    signIn,
    isConnected,
    details,
    loading: loadingWallet,
    signOut,
  } = useWallet()
  const { network, contractAddress } = useApp()

  const [showExtraMenu, setShowExtraMenu] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)

  const router = useRouter()

  const tabs = [
    {
      title: 'Your Moments',
      component: (
        <OwnedMoments
          accountId={details.accountId ?? ''}
          contractAddress={contractAddress}
        />
      ),
    },
    {
      title: 'Offered Moments',
      component: (
        <MintedMoments
          accountId={details.accountId ?? ''}
          contractAddress={contractAddress}
        />
      ),
    },
    {
      title: 'Minsta Feeds',
      component: (
        <MinstaFeeds
          accountId={details.accountId ?? ''}
          proxyAddress={details.proxyAddress}
          store={details.nftContractAddress}
        />
      ),
    },
  ]

  return (
    <div className="bg-black min-h-screen">
      <Header>
        <GoBackButton />
        <h1 className="text-lg font-bold">Profile</h1>
        <div
          className="w-5 h-5 relative"
          onClick={() => setShowExtraMenu(!showExtraMenu)}
        >
          <DotsHorizontalIcon />
          {showExtraMenu ? (
            <div className="absolute right-1 p-4 bg-neutral-900 rounded">
              <ul className="flex flex-col gap-12 w-max font-bold">
                <li
                  className="text-sm cursor-pointer"
                  onClick={() => router.push('/create')}
                >
                  Create your Minsta feed
                </li>
                <li
                  className="text-sm cursor-pointer"
                  onClick={async () => {
                    await router.push('/')
                    signOut()
                  }}
                >
                  Disconnect
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </Header>
      {isConnected && !loadingWallet && details?.accountId ? (
        <>
          <div style={{ padding: '52px 32px' }}>
            <div className="flex flex-col justify-center items-center mt-12 gap-4">
              <div className="w-36 h-36 relative">
                <UserImage account={details.accountId} />
              </div>
              <div className="text-white font-bold">{details.accountId}</div>
            </div>
          </div>
          <div>
            <div className="sm:mt-12 flex flex-wrap items-center gap-2 justify-center">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`${
                    index === currentTab ? 'text-white' : 'text-gray-500'
                  } font-bold text-sm sm:text-xl cursor-pointer`}
                  onClick={() => setCurrentTab(index)}
                >
                  {tab.title}
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-12 pb-12">
              {tabs[currentTab].component}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default AccountPage
