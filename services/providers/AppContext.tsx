import React, { useContext, useState, createContext } from 'react'

// @ts-ignore
export const AppContext = createContext<{
  dataUrl: string | undefined
  setDataUrl: (dataUrl: string) => void
  network: string
  contractAddress: string
}>({
  dataUrl: undefined,
  setDataUrl: (dataUrl: string | undefined) => null,
  network: '',
  contractAddress: '',
})

interface IAppConsumer {
  network: string
  contractAddress: string
  dataUrl: string | undefined
  setDataUrl: (dataUrl: string) => void
}

export const AppProvider = ({
  children,
  network,
  contractAddress,
}: {
  children: React.ReactNode
  network: string
  contractAddress: string
}) => {
  const [dataUrl, _setDataUrl] = useState<string | undefined>(undefined)

  const setDataUrl = (dataUrl: string | undefined) => {
    _setDataUrl(dataUrl)
  }
  return (
    <AppContext.Provider
      value={{ dataUrl, setDataUrl, network, contractAddress }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext<IAppConsumer>(AppContext)
