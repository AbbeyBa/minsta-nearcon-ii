import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../services/apolloClient'

import 'tailwindcss/tailwind.css'
import '../styles/global.css'

import {
  GRAPH_MAINNET_HTTPS_URI,
  GRAPH_TESTNET_HTTPS_URI,
} from '../constants/mintbase'
import { NearWalletProvider } from '../services/providers/NearWalletProvider'
import Head from 'next/head'
import { AppProvider } from '../services/providers/AppContext'
import { useInterval } from 'usehooks-ts'
import { useMemo, useState } from 'react'
import SplashScreen from '../components/pages/SplashScreen'
import { Network } from 'mintbase'
import { useRouter } from 'next/router'

export const MINTBASE_SUFFIX = (network: string) =>
  network === 'testnet' ? '.mintspace2.testnet' : '.mintbase1.near'
const PROXY_CONTRACT = (network: string) =>
  network === 'testnet'
    ? 'dev-1662838950242-10877157053447'
    : 'proxy2.minsta.near'

type Props = AppProps & {
  subdomain: string
  network: string
}

function MyApp(props: Props) {
  const { Component, pageProps } = props
  const router = useRouter()

  const { network: routerNetwork } = router.query
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true)

  const network = useMemo(() => {
    return (
      (routerNetwork as string) ||
      process.env.NEXT_PUBLIC_MB_NETWORK ||
      'testnet'
    )
  }, [routerNetwork])

  const apolloClient = useApollo({
    ...pageProps,
    network: {
      graphUri:
        network === 'testnet'
          ? GRAPH_TESTNET_HTTPS_URI
          : GRAPH_MAINNET_HTTPS_URI,
    },
  })
  useInterval(
    () => {
      setShowSplashScreen(false)
    },
    showSplashScreen ? 1500 : null
  )

  // FIXME: I hate this block of code. But had to do it :sprint:
  let name = ''
  if (typeof window !== 'undefined') {
    const host = window.location.host
    name = host?.split('.')[0]
    if (name === 'www' || name.includes('localhost')) name = 'minsta'
  } else {
    name = props?.subdomain
  }

  if (typeof window !== 'undefined') {
    // Get correct Height for Mobile
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <AppProvider
        network={network}
        contractAddress={`${name || 'minsta'}${MINTBASE_SUFFIX(network)}`}
      >
        <NearWalletProvider
          proxyAddress={PROXY_CONTRACT(network)}
          nftContractAddress={`${name || 'minsta'}${MINTBASE_SUFFIX(network)}`}
          network={network as Network}
        >
          <ApolloProvider client={apolloClient}>
            <div className="full-screen-height">
              {showSplashScreen ? (
                <SplashScreen />
              ) : (
                <Component {...pageProps} />
              )}
            </div>
          </ApolloProvider>
        </NearWalletProvider>
      </AppProvider>
    </>
  )
}

MyApp.getInitialProps = async (context: AppContext) => {
  const host = context.ctx.req?.headers.host
  const name = host?.split('.')[0]

  return {
    subdomain:
      name?.includes('localhost') || host?.includes('vercel.app') ? null : name,
    network: process.env.NETWORK || 'testnet',
  }
}

export default MyApp
