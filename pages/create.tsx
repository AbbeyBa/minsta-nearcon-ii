import { useLazyQuery } from '@apollo/client'
import { FastForwardIcon } from '@heroicons/react/solid'
import { debounce } from 'lodash'
import { useState } from 'react'
import Footer from '../components/layout/Footer'
import GoBackButton from '../components/layout/GoBackButton'
import Header from '../components/layout/Header'
import { CHECK_STORE } from '../queries/stores.graphql'
import { useWallet } from '../services/providers/NearWalletProvider'

enum StoreError {
  INVALID_NAME = 'invalid_name',
  EXISTS = 'exists',
}

const Create = () => {
  const { loading, isConnected, wallet, details } = useWallet()

  const [storeError, setStoreError] = useState<StoreError | null>(null)
  const [storeName, setStoreName] = useState<string>('')

  const [checkStoreNameExists] = useLazyQuery<any>(CHECK_STORE, {
    onCompleted: (data) => {
      setStoreError(data?.nft_contracts.length > 0 ? StoreError.EXISTS : null)
    },
  })

  const checkNameExists = async (name: string) => {
    await checkStoreNameExists({
      variables: { name },
    })
  }

  const createMinstaFeed = async () => {
    if (storeError || !storeName) return
    const mbSuffix =
      details.network === 'testnet' ? 'mintspace2.testnet' : 'mintbase1.near'

    const createStoreTx = {
      signerId: details.accountId,
      receiverId: mbSuffix,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'create_store',
            args: {
              owner_id: details.accountId,
              metadata: {
                spec: 'nft-1.0.0',
                name: `${storeName}`,
                symbol: 'minst',
                icon: 'data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAJCT/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQAAEQAAAAEAEAEAEAAAAQAQAQAQAAAAEREREQAAAAAAEAAAAAAAAAAQAAAAAAAAABEQAAEQAAAAEAEAEAEAAAAQAQAQAQAAAAEREREQAAAAAAAAEAAAAAAAAAAQAAAAAAAAERAAAAAAAAEAEAAAAAAAAQAQAAAAAAAAEQAADnnwAA228AANtvAADgHwAA+/8AAPv/AAD48wAA+20AAPttAAD8AwAA/+8AAP/vAAD/jwAA/28AAP9vAAD/nwAA',
                base_uri: 'https://arweave.net/',
                reference: null,
                reference_hash: null,
              },
            },
            gas: '200000000000000',
            deposit: '6500000000000000000000000',
          },
        },
      ],
    }

    const grantMinterTx = {
      signerId: details.accountId,
      receiverId: `${storeName}.${mbSuffix}`,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'grant_minter',
            args: {
              account_id: details.proxyAddress,
            },
            gas: '200000000000000',
            deposit: '1',
          },
        },
      ],
    }

    const txs: any[] = [createStoreTx, grantMinterTx]

    await wallet?.signAndSendTransactions({
      transactions: txs,
      callbackUrl: `${window.location.origin}/${details.accountId}`,
    })
  }

  return (
    <div className="bg-black min-h-screen">
      <Header>
        <GoBackButton goPreviousPage />
        <h1 className="text-lg font-bold">Create</h1>
        <div className="w-5 h-5"></div>
      </Header>
      <main className="absolute top-1/2 transform -translate-y-1/2 w-full px-8">
        <div className="text-white">
          <label className="flex w-full flex-col gap-4">
            <p className="font-bold">Store name</p>
            <input
              placeholder="heynearcon"
              className="p-2 rounded bg-black border border-white"
              onChange={debounce(async (evt) => {
                setStoreError(null)
                const name = evt.target.value.replace(/\s/g, '').toLowerCase()
                if (/^[a-z0-9]{1,20}$/.test(name) && name.length <= 20) {
                  await checkNameExists(name)
                  setStoreName(name)
                } else {
                  setStoreError(StoreError.INVALID_NAME)
                }
              }, 700)}
            />
          </label>
        </div>
        {storeError === StoreError.EXISTS ? (
          <p className="text-sm text-red-300 mt-2">
            Store name already exists.
          </p>
        ) : null}
        {storeError === StoreError.INVALID_NAME ? (
          <p className="text-sm text-red-300 mt-2">
            Name can only contain lowercase letters and numbers, and can&apos;t
            be longer than 20 characters.
          </p>
        ) : null}
      </main>
      <Footer>
        <div className="text-white px-4 py-4 w-full justify-center flex">
          <div className="w-10 h-10" onClick={() => createMinstaFeed()}>
            <FastForwardIcon />
          </div>
        </div>
      </Footer>
    </div>
  )
}

export default Create
