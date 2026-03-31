import './App.css'
import { TrailsWidget } from '0xtrails'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { TokenBalance } from './TokenBalance'

function App() {
  const { ready, authenticated, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const privyWallet = wallets?.find((w) => w.walletClientType === 'privy')

  if (!ready) return <div className="center">Loading...</div>

  return (
    <div className="center">
      <h1>Trails &amp; Privy boilerplate</h1>
      {authenticated ? (
        <>
          {privyWallet?.address && (
            <TokenBalance address={privyWallet.address as `0x${string}`} />
          )}
          <TrailsWidget
            apiKey={import.meta.env.VITE_TRAILS_CLIENT_API_KEY!}
            mode="fund"
            toAddress={privyWallet?.address}
            toToken={"USDC"}
            toChainId={137}
            fundOptions={{
              hideWallets: privyWallet?.address ? [privyWallet.address] : undefined 
            }}
            buttonText='Fund your wallet'
            theme="light"
          />
          <button className="btn" onClick={logout}>Logout</button>
        </>
      ) : (
        <button className="btn" onClick={login}>Sign in with Privy</button>
      )}
    </div>
  )
}

export default App
