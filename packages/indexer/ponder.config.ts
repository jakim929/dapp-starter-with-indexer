import { createConfig } from '@ponder/core'
import { erc721ABI } from '@wagmi/core'
import { Chain, http } from 'viem'
import {
  base,
  baseGoerli,
  foundry,
  optimism,
  optimismGoerli,
} from 'viem/chains'
import { z } from 'zod'
import { Address as AddressSchema } from 'abitype/zod'

const envVarSchema = z.object({
  JSON_RPC_HTTP_URL: z.string(),
  CHAIN_ID: z.coerce.number(),
  CONTRACT_ADDRESS: AddressSchema,
})

const envVars = envVarSchema.parse(process.env)

const chainById = {
  [optimism.id]: optimism,
  [optimismGoerli.id]: optimismGoerli,
  [base.id]: base,
  [baseGoerli.id]: baseGoerli,
  [foundry.id]: foundry,
} as const satisfies Record<number, Chain>

type SupportedChainId = keyof typeof chainById

const chain = chainById[envVars.CHAIN_ID as SupportedChainId]

export default createConfig({
  networks: {
    [chain.name]: {
      chainId: envVars.CHAIN_ID,
      transport: http(envVars.JSON_RPC_HTTP_URL),
    },
  },
  contracts: {
    TestNFT: {
      network: chain.name,
      abi: erc721ABI,
      address: envVars.CONTRACT_ADDRESS,
      startBlock: 0,
    },
  },
})
