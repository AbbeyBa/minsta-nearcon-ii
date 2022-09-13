import { gql } from 'apollo-boost'

export const CHECK_STORE = gql`
  query CheckStore($name: String!) {
    nft_contracts(where: { name: { _eq: $name } }) {
      name
    }
  }
`

export const CHECK_ONWER_MINSTAS = gql`
  query CheckOwnerMinstas($accountId: String!, $proxyAddress: String!) {
    mb_store_minters(
      where: {
        nft_contracts: { owner_id: { _eq: $accountId } }
        minter_id: { _eq: $proxyAddress }
      }
    ) {
      nft_contracts {
        name
      }
    }
  }
`
