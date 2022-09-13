import { CreditCardIcon as CreditCardIconOutline } from '@heroicons/react/outline'
import { CameraIcon, UserGroupIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '../../services/providers/AppContext'
import { useWallet } from '../../services/providers/NearWalletProvider'
import CurrentFeed from '../Feed/CurrentFeed'
import ExploreFeed from '../Feed/ExploreFeed'
import Footer from '../layout/Footer'
import Header from '../layout/Header'
import UserImage from '../layout/UserImage'

const Gram = () => {
  const { details } = useWallet()
  const { contractAddress } = useApp()

  const [currentTab, setCurrentTab] = useState(0)

  const tabs = [
    {
      title: 'Current',
      component: (
        <CurrentFeed
          accountId={details.proxyAddress}
          contractAddress={contractAddress}
        />
      ),
    },
    {
      title: 'Explore',
      component: (
        <ExploreFeed
          accountId={details.proxyAddress}
          contractAddress={contractAddress}
        />
      ),
    },
  ]

  return (
    <>
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
      <div className="mt-4 sm:mt-12 pb-12">{tabs[currentTab].component}</div>
    </>
  )
}

const Feed = () => {
  const { signIn, isConnected, details, loading, signOut } = useWallet()

  return (
    <div className="bg-black min-h-screen">
      <Header>
        <div className="grid grid-cols-3 w-full justify-between items-center">
          <Link href="/leaderboard">
            <UserGroupIcon className="h-5 w-5 text-left" />
          </Link>
          <h1 className="text-lg font-bold  text-center">Minsta.</h1>
          {!loading && isConnected && details?.accountId && (
            <>
              <div className="w-full flex justify-end">
                <Link href={`/${details.accountId}`}>
                  <div className="w-7 h-7 relative">
                    <UserImage account={details.accountId} />
                  </div>
                </Link>
              </div>
            </>
          )}
          {!loading && !isConnected && (
            <div className="text-xs flex justify-end  w-full">
              <button onClick={signIn} className="flex gap-2 items-center">
                <CreditCardIconOutline className="h-5 w-5" />
                <p>Connect</p>
              </button>
            </div>
          )}
        </div>
      </Header>
      <main
        className="text-white flex flex-col justify-center no-scrollbar"
        style={{ padding: '52px 0' }}
      >
        <Gram />
      </main>
      {isConnected && !loading && (
        <Footer>
          <div className="text-white px-4 py-4 w-full justify-center flex">
            <Link href="/camera">
              <CameraIcon className="h-5 w-5" />
            </Link>
          </div>
        </Footer>
      )}
    </div>
  )
}

export default Feed
