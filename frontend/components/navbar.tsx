'use client'

import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const pathname = usePathname()

  // Format address for display (e.g., 0x1234...5678)
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handle wallet connection
  const handleConnect = () => {
    open()
  }

  // Handle disconnect confirmation
  const handleDisconnectClick = () => {
    setShowDisconnectModal(true)
  }

  // Handle disconnect cancellation
  const handleCancelDisconnect = () => {
    setShowDisconnectModal(false)
  }

  // Handle disconnect confirmation
  const handleConfirmDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    } finally {
      setShowDisconnectModal(false)
    }
  }

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-bold">Web3 Boilerplate</h1>
        
        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link 
            href="/create-market" 
            className={`transition-colors hover:text-primary ${
              pathname === '/create-market' ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
          >
            Create Market
          </Link>
          <Link 
            href="/market-summary" 
            className={`transition-colors hover:text-primary ${
              pathname === '/market-summary' ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
          >
            Market Summary
          </Link>
          <Link 
            href="/prediction-market" 
            className={`transition-colors hover:text-primary ${
              pathname === '/prediction-market' ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
          >
            Prediction Market
          </Link>
        </div>
      </div>
      
      <div>
        {isConnected ? (
          <div className="relative">
            <Button 
              variant="outline"
              className="transition-colors hover:bg-red-500 hover:text-white hover:border-red-500"
              onClick={handleDisconnectClick}
            >
              {formatAddress(address || '')}
            </Button>
            
            {/* Disconnect confirmation modal */}
            {showDisconnectModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Disconnect Wallet</h2>
                  <p className="mb-6">Are you sure you want to disconnect your wallet?</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelDisconnect}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirmDisconnect}>
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={handleConnect}>Connect Wallet</Button>
        )}
      </div>
    </nav>
  )
}