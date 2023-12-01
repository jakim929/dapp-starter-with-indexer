import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { envVars } from '@/lib/envVars'
import { TestNFTAbi } from '@/constants/TestNFTAbi'
import { useTestNFTsForOwner } from '@/lib/getTestNFTsForOwner'

const MintButton = () => {
  const { config, isLoading: isConfigLoading } = usePrepareContractWrite({
    address: envVars.VITE_TEST_NFT_CONTRACT_ADDRESS,
    abi: TestNFTAbi,
    functionName: 'mint',
  })

  const { data, write, isLoading: isMintLoading } = useContractWrite(config)

  const { isLoading: isTransactionLoading } = useWaitForTransaction({
    hash: data?.hash,
  })

  const isLoading = isConfigLoading || isMintLoading || isTransactionLoading

  return (
    <Button disabled={isLoading || !write} onClick={() => write?.()}>
      Mint TestNFT
    </Button>
  )
}

const TestNFTBalance = () => {
  const { address } = useAccount()
  const { data, isLoading } = useTestNFTsForOwner(address)
  if (isLoading || !data) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex flex-col">
      <div>Current balance: {data.length}</div>
      <div>TestNFTs: {data.map((tokenId) => `#${tokenId}`).join(', ')}</div>
    </div>
  )
}

export const MintTestNFTCard = () => {
  return (
    <Card className="max-w-md min-w-[300px]">
      <CardHeader>
        <CardTitle>Mint TestNFT</CardTitle>
        <CardDescription>Mint a TestNFT to your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <TestNFTBalance />
        <MintButton />
      </CardContent>
    </Card>
  )
}
