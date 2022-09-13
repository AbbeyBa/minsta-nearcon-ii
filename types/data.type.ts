export interface TokenData {
  token: {
    id: string
    createdAt: string
    storeId?: string
    thing: {
      id: string
      metadata: { media: string; title: string; description: string }
    }
  }[]
}

export interface ControllerProps {
  accountId: string
  contractAddress: string
}
