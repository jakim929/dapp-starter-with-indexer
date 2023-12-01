import { envVars } from '@/lib/envVars'
import { Chain as ZeusGraphqlChain } from '@dapp-starter-with-indexer/indexer'
import { Address } from 'viem'
import { useQuery } from 'wagmi'

const graphqlClient = ZeusGraphqlChain(envVars.VITE_INDEXER_URL)

export const getTestNFTsForOwner = async (owner: Address) => {
  const { account } = await graphqlClient('query')({
    account: [
      {
        id: owner,
      },
      {
        tokens: [
          {},
          {
            id: true,
          },
        ],
      },
    ],
  })

  if (!account) {
    return []
  }
  return (account.tokens as { id: string }[]).map((token: { id: string }) =>
    BigInt(token.id),
  )
}

export const useTestNFTsForOwner = (owner?: Address) => {
  return useQuery(['TestNFTsForOwner', owner], {
    queryFn: () => getTestNFTsForOwner(owner!),
    enabled: !!owner,
    refetchInterval: 2000,
  })
}
