import { gql } from 'apollo-boost'

export const FETCH_MINTED_THINGS = gql`
  query FetchFeedMintedThings($accountId: String!, $contractAddress: String) {
    token(
      where: {
        minter: { _eq: $accountId }
        storeId: { _eq: $contractAddress }
        burnedAt: { _is_null: true }
      }

      order_by: { createdAt: desc }
    ) {
      id
      createdAt
      thing {
        id
        metadata {
          media
          title
          description
        }
      }
    }
  }
`

export const FETCH_EXPLORE_THINGS = gql`
  query FetchFeedExploreThings($accountId: String!, $contractAddress: String) {
    token(
      where: {
        minter: { _eq: $accountId }
        storeId: { _neq: $contractAddress }
        burnedAt: { _is_null: true }
      }
      order_by: { createdAt: desc, storeId: asc }
      distinct_on: storeId
    ) {
      id
      createdAt
      storeId
      thing {
        id
        metadata {
          media
          title
          description
        }
      }
    }
  }
`

export const FETCH_USER_OWNED = gql`
  query FetchUserOwnedThings($accountId: String!, $contractAddress: String) {
    token(
      where: {
        ownerId: { _eq: $accountId }
        storeId: { _eq: $contractAddress }
        burnedAt: { _is_null: true }
      }

      order_by: { createdAt: desc }
    ) {
      id
      createdAt
      thing {
        id
        metadata {
          media
          title
          description
        }
      }
    }
  }
`

export const FETCH_USER_CREATED = gql`
  query FetchUserMintedThings($accountId: String!, $contractAddress: String) {
    token(
      where: {
        storeId: { _eq: $contractAddress }
        burnedAt: { _is_null: true }
        royaltys: { account: { _eq: $accountId } }
      }
      order_by: { createdAt: desc }
    ) {
      id
      createdAt
      thing {
        id
        metadata {
          media
          title
          description
        }
      }
    }
  }
`
