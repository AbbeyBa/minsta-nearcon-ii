import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type {
  WalletSelector,
  AccountState,
  Wallet,
} from '@near-wallet-selector/core'
import type { WalletSelectorModal } from '@near-wallet-selector/modal-ui'
import { Network } from 'mintbase'
import { init } from '../../modules/near-wallet-selector'

interface IWalletProvider {
  network?: 'testnet' | 'mainnet'
  chain?: string
  proxyAddress?: string
  nftContractAddress?: string
  children?: ReactNode
}

export const WalletContext = createContext<{
  wallet: Wallet | undefined
  details: {
    accountId?: string
    balance: string
    proxyAddress: string
    nftContractAddress: string
    network: string
  }
  isConnected: boolean
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}>({
  wallet: undefined,
  details: {
    accountId: '',
    balance: '',
    nftContractAddress: '',
    proxyAddress: '',
    network: '',
  },
  isConnected: false,
  loading: true,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
})

interface IWalletConsumer {
  wallet: Wallet | undefined
  isConnected: boolean
  details: {
    accountId?: string
    balance: string
    proxyAddress: string
    nftContractAddress: string
    network: string
  }
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const NearWalletProvider = (props: IWalletProvider) => {
  const {
    network = 'testnet',
    proxyAddress,
    nftContractAddress,
    children,
  } = props

  const [selector, setSelector] = useState<WalletSelector | null>(null)
  const [modal, setModal] = useState<WalletSelectorModal | null>(null)
  const [accounts, setAccounts] = useState<Array<AccountState>>([])
  const [wallet, setWallet] = useState<Wallet | undefined>()

  const [loading, setLoading] = useState(true)

  const activeAccount = useMemo(() => {
    return accounts.find((account) => account.active)?.accountId || undefined
  }, [accounts])

  const initSelector = useCallback(async () => {
    const walletSelector = await init({
      network: network as Network,
      contractAddress: proxyAddress as string,
    })

    const _selector = walletSelector.selector
    const _modal = walletSelector.modal

    setSelector(_selector)
    setModal(_modal)

    const state = _selector.store.getState()
    setAccounts(state.accounts)

    try {
      const wallet = await _selector.wallet()
      setWallet(wallet)
    } catch (error) {}

    setLoading(false)
  }, [])

  useEffect(() => {
    initSelector()
      .then(() => {
        console.log('Initialized wallet selector successfuly!')
      })
      .catch((err) => {
        console.error(err)
        alert('Failed to initialise wallet selector')
      })
  }, [init])

  const signIn = async () => {
    if (!modal) return

    modal.show()
  }

  const signOut = async () => {
    if (!wallet) return

    await wallet?.signOut()

    window.location.reload()
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        details: {
          accountId: activeAccount,
          balance: '',
          proxyAddress: proxyAddress || '',
          nftContractAddress: nftContractAddress || '',
          network: network,
        },
        isConnected: !!activeAccount,
        signIn: signIn,
        signOut: signOut,
        loading: loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext<IWalletConsumer>(WalletContext)
