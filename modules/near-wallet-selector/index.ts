import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core'
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui'
import { setupNearWallet } from '@near-wallet-selector/near-wallet'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupSender } from '@near-wallet-selector/sender'
import { setupMathWallet } from '@near-wallet-selector/math-wallet'
import { setupNightly } from '@near-wallet-selector/nightly'
import { setupLedger } from '@near-wallet-selector/ledger'
import { setupDefaultWallets } from '@near-wallet-selector/default-wallets'
import { Network } from 'mintbase'

type NearWalletSelector = {
  modal: WalletSelectorModal
  selector: WalletSelector
}

export const init = async ({
  network,
  contractAddress,
}: {
  network: Network
  contractAddress: string
}): Promise<NearWalletSelector> => {
  const selector = await setupWalletSelector({
    network: network,
    debug: true,
    modules: [
      ...(await setupDefaultWallets()),
      setupNearWallet(),
      setupMyNearWallet(),
      setupSender(),
      setupMathWallet(),
      setupNightly(),
      setupLedger(),
    ],
  })

  const modal = setupModal(selector, {
    contractId: contractAddress,
  })

  return {
    selector,
    modal,
  }
}
