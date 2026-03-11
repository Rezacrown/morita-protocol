"use client";

import { useAccount, useConnect, useDisconnect } from "@starknet-start/react";
import { useCallback, useEffect, useState } from "react";

// Key untuk localStorage
const LAST_CONNECTED_WALLET_KEY = "morita_last_connected_wallet";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Format address pendek (contoh: 0x049d...8f2a)
  const formatShortAddress = useCallback((addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // Simple reconnect on mount - hanya coba sekali
  useEffect(() => {
    const lastWallet = localStorage.getItem(LAST_CONNECTED_WALLET_KEY);
    if (lastWallet && !isConnected && connectors.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const connector = (connectors as any[]).find(
        (c) => c.name?.toLowerCase() === lastWallet.toLowerCase(),
      );
      if (connector) {
        console.log("[ConnectWallet] Auto-reconnecting to:", lastWallet);
        connect({ connector });
      }
    }
  }, [connect, connectors, isConnected]);

  // Handle connect ke wallet
  const handleConnect = useCallback(
    async (walletName: string) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const connector = (connectors as any[]).find(
          (c) => c.name?.toLowerCase() === walletName.toLowerCase(),
        );
        if (connector) {
          await connect({ connector });
          localStorage.setItem(LAST_CONNECTED_WALLET_KEY, walletName);
        }
      } catch (error) {
        console.error("Connect error:", error);
      }
      setIsModalOpen(false);
    },
    [connect, connectors],
  );

  // Handle disconnect
  const handleDisconnect = useCallback(() => {
    disconnect();
    localStorage.removeItem(LAST_CONNECTED_WALLET_KEY);
    setIsPopupOpen(false);
  }, [disconnect]);

  // Handle toggle button utama
  const handleToggle = useCallback(() => {
    if (isConnected && address) {
      // Toggle popup
      setIsPopupOpen(!isPopupOpen);
    } else {
      setIsModalOpen(true);
    }
  }, [isConnected, address, isPopupOpen]);

  // Handle backdrop click untuk modal wallet selection
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  }, []);

  return (
    <>
      <button
        onClick={handleToggle}
        className={`px-6 py-2.5 rounded-full text-sm tracking-wide transition-colors ${
          isConnected
            ? "bg-transparent border border-black/20 text-black hover:bg-black/5 font-mono"
            : "bg-black text-white hover:bg-black/80"
        }`}
        title={address || "Click to connect wallet"}
      >
        {isConnected && address
          ? formatShortAddress(address)
          : "Connect Wallet"}
      </button>

      {/* Wallet Selection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Wallet
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2">
              {connectors.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                connectors.map((connector: any, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleConnect(connector.name)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {connector.icon?.darkUrl || connector.icon?.url ? (
                        <img
                          src={connector.icon?.darkUrl || connector.icon?.url}
                          alt={connector.name}
                          className="w-6 h-6"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-400">
                          {connector.name?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {connector.name}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No Starknet wallets found. Please install Argent X or Braavos.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Popup */}
      {isPopupOpen && isConnected && address && (
        <div
          className="fixed z-50"
          style={{
            top: "var(--navbar-height, 64px)",
            right: "var(--container-padding, 24px)",
          }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-64 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Connected Wallet
              </p>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-mono text-gray-900">
                  {formatShortAddress(address)}
                </p>
                <p className="text-xs text-gray-400">Click to copy</p>
              </div>
            </button>
            <div className="px-4 py-2">
              <div className="h-px bg-gray-100" />
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <span className="font-medium">Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
