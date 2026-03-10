"use client";

import { useAccount, useConnect, useDisconnect } from "@starknet-start/react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Wallet yang support Starknet
const STARKNET_WALLETS = ["Argent X", "Braavos"];

// Key untuk localStorage
const LAST_CONNECTED_WALLET_KEY = "morita_last_connected_wallet";
const LAST_CONNECTED_ADDRESS_KEY = "morita_last_connected_address";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Format address pendek (contoh: 0x049d...8f2a)
  const formatShortAddress = useCallback((addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // Format address lengkap dengan 0x prefix
  const formatFullAddress = useCallback((addr: string | undefined) => {
    if (!addr) return "";
    return addr.startsWith("0x") ? addr : `0x${addr}`;
  }, []);

  // Handle copy address ke clipboard
  const handleCopyAddress = useCallback(async () => {
    if (address) {
      await navigator.clipboard.writeText(formatFullAddress(address));
      setIsPopupOpen(false);
    }
  }, [address, formatFullAddress]);

  // Filter hanya wallet yang support Starknet (Argent X, Braavos)
  const filteredConnectors = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return connectors.filter((c: any) => {
      const name = c.name || "";
      return STARKNET_WALLETS.some((wallet) =>
        name.toLowerCase().includes(wallet.toLowerCase()),
      );
    });
  }, [connectors]);

  // Cari wallet connector untuk Argent X atau Braavos
  const preferredConnector = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connector = filteredConnectors.find((c: any) => {
      const name = c.name?.toLowerCase() || "";
      return name.includes("argent") || name.includes("braavos");
    });
    return connector || filteredConnectors[0];
  }, [filteredConnectors]);

  // Handle connect ke wallet tertentu dengan graceful error handling
  const handleConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (connector: any) => {
      try {
        await connect({ connector });
        // Simpan ke localStorage setelah berhasil connect
        localStorage.setItem(LAST_CONNECTED_WALLET_KEY, connector.name || "");
        if (address) {
          localStorage.setItem(LAST_CONNECTED_ADDRESS_KEY, address);
        }
      } catch {
        // User reject atau error - tutup modal tanpa error
      }
      setIsModalOpen(false);
    },
    [connect, address],
  );

  // Handle disconnect
  const handleDisconnect = useCallback(() => {
    disconnect();
    localStorage.removeItem(LAST_CONNECTED_WALLET_KEY);
    localStorage.removeItem(LAST_CONNECTED_ADDRESS_KEY);
    setIsPopupOpen(false);
  }, [disconnect]);

  // Handle toggle button
  const handleToggle = useCallback(() => {
    if (isConnected && address) {
      setIsPopupOpen(!isPopupOpen);
    } else {
      setIsModalOpen(true);
    }
  }, [isConnected, address, isPopupOpen]);

  // Tutup modal/popup saat klik di luar
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setIsPopupOpen(false);
    }
  }, []);

  // Tutup popup saat escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Set document title untuk aksesibilitas
  useEffect(() => {
    if (isConnected && address) {
      document.title = `Connected: ${formatShortAddress(address)}`;
    } else {
      document.title = "Connect Wallet";
    }
  }, [isConnected, address, formatShortAddress]);

  // Auto-reconnect logic saat mount
  useEffect(() => {
    // Restore last connected wallet dari localStorage
    const lastConnectedWalletName = localStorage.getItem(
      LAST_CONNECTED_WALLET_KEY,
    );

    // Auto-reconnect jika ada data tersimpan dan wallet belum terhubung
    if (
      lastConnectedWalletName &&
      !isConnected &&
      filteredConnectors.length > 0
    ) {
      const connector = filteredConnectors.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) =>
          c.name?.toLowerCase().includes(lastConnectedWalletName.toLowerCase()),
      );

      if (connector) {
        // Auto-connect attempt
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        connect({ connector });
      }
    }

    // Selesai loading setelah check
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [isConnected, filteredConnectors, connect]);

  // Listen untuk accountsChanged event dari wallet
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAccountsChanged = (event: CustomEvent<any[]>) => {
      const accounts = event.detail || [];
      if (accounts.length === 0) {
        // User disconnect dari wallet popup
        disconnect();
        localStorage.removeItem(LAST_CONNECTED_ADDRESS_KEY);
      } else {
        // Update localStorage dengan address baru
        localStorage.setItem(LAST_CONNECTED_ADDRESS_KEY, accounts[0]);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDisconnectEvent = () => {
      disconnect();
      localStorage.removeItem(LAST_CONNECTED_ADDRESS_KEY);
    };

    // Listen pada window level untuk menangkap event dari wallet
    window.addEventListener(
      "starknet_accountsChanged",
      handleAccountsChanged as EventListener,
    );
    window.addEventListener(
      "starknet_disconnect",
      handleDisconnectEvent as EventListener,
    );

    return () => {
      window.removeEventListener(
        "starknet_accountsChanged",
        handleAccountsChanged as EventListener,
      );
      window.removeEventListener(
        "starknet_disconnect",
        handleDisconnectEvent as EventListener,
      );
    };
  }, [disconnect]);

  // Tampilkan loading indicator saat checking connection
  if (isLoading) {
    return (
      <button
        disabled
        className="px-6 py-2.5 rounded-full text-sm tracking-wide transition-colors bg-gray-100 text-gray-400 font-mono cursor-wait"
      >
        Loading...
      </button>
    );
  }

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-scale-in">
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
              {filteredConnectors.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filteredConnectors.map((connector: any, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleConnect(connector)}
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
          className="fixed z-50 animate-fade-in"
          style={{
            top: "var(--navbar-height, 64px)",
            right: "var(--container-padding, 24px)",
          }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-64 overflow-hidden animate-scale-in">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Connected Wallet
              </p>
            </div>
            <button
              onClick={handleCopyAddress}
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

      {/* Global styles untuk animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
