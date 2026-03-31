import { useEffect, useState } from 'react'
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

interface TokenBalanceProps {
  address: `0x${string}`
  refetchTrigger?: number
}

export function TokenBalance({ address, refetchTrigger = 0 }: TokenBalanceProps) {
  const { data: raw, isLoading, isError, refetch } = useReadContract({
    address: USDC_POLYGON,
    abi: erc20BalanceOf,
    functionName: 'balanceOf',
    args: [address],
    chainId: polygon.id,
  })

  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    if (refetchTrigger > 0) refetch()
  }, [refetchTrigger, refetch])

  const handleRefresh = () => {
    setSpinning(true)
    refetch()
    setTimeout(() => setSpinning(false), 600)
  }

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
            <button
              className={`refresh-btn${spinning ? ' spinning' : ''}`}
              onClick={handleRefresh}
              aria-label="Refresh balance"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6" />
                <path d="M2.5 22v-6h6" />
                <path d="M2.5 11.5a10 10 0 0 1 18.4-4.5L21.5 8" />
                <path d="M21.5 12.5a10 10 0 0 1-18.4 4.5L2.5 16" />
              </svg>
            </button>
          </span>
        )}
      </div>
  )
}
