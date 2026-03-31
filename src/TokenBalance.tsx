import { useReadContract } from 'wagmi'
import { polygon } from 'wagmi/chains'

const USDC_POLYGON = '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' as const

const erc20BalanceOf = [{
  type: 'function',
  name: 'balanceOf',
  stateMutability: 'view',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ name: '', type: 'uint256' }],
}] as const

export function TokenBalance({ address }: { address: `0x${string}` }) {
  const { data: raw, isLoading, isError, refetch } = useReadContract({
    address: USDC_POLYGON,
    abi: erc20BalanceOf,
    functionName: 'balanceOf',
    args: [address],
    chainId: polygon.id,
  })

  const formatted = raw !== undefined ? (Number(raw) / 1e6).toString() : null
  const display = formatted
    ? Number(formatted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null

  return (
    <div className="balance-card">
      <span className="balance-label">
        Wallet balance on{' '}
        <a
          href={`https://polygonscan.com/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Polygon
        </a>
      </span>
      {isLoading ? (
        <span className="balance-value shimmer">--</span>
      ) : isError ? (
        <span className="balance-value error">Error</span>
      ) : (
        <span className="balance-value">
          <img
            className="balance-icon"
            src="https://assets.sequence.info/images/tokens/large/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.webp"
            alt="USDC"
          />
          {display}
        </span>
      )}
    </div>
  )
}
