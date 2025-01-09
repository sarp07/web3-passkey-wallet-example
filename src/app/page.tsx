"use client";

import Image from "next/image";
import { useConnect } from "thirdweb/react";
import { useActiveWallet, useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import { inAppWallet, hasStoredPasskey } from "thirdweb/wallets/in-app";
import { useState } from "react";

export default function Home() {
  const { connect } = useConnect();
  const activeWallet = useActiveWallet();
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await connect(async () => {
        const wallet = inAppWallet({
          auth: {
            options: ["passkey"],
            passkeyDomain: process.env.NODE_ENV === 'production' 
              ? window.location.hostname 
              : "localhost", 
          },
        });
        
        const hasPasskey = await hasStoredPasskey(client);
        await wallet.connect({
          client,
          strategy: "passkey",
          type: hasPasskey ? "sign-in" : "sign-up",
        });
        return wallet;
      });
    } catch (error) {
      // Sessiz hata yönetimi
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      if (activeWallet) {
        await activeWallet.disconnect();
      }
    } catch (error) {
      // Sessiz hata yönetimi
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (account?.address) {
      try {
        await navigator.clipboard.writeText(account.address);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        // Sessiz hata yönetimi
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#112240] safe-top safe-bottom">
      {!activeWallet ? (
        // Login öncesi görünüm
        <div className="min-h-screen flex items-center justify-center px-4 py-safe">
          <div className="max-w-md w-full space-y-8 bg-[#1a2744] p-6 sm:p-8 rounded-2xl shadow-xl border border-[#233154] m-safe">
            <div className="flex flex-col items-center">
              <Image
                src={thirdwebIcon}
                alt="Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 mb-6"
                style={{
                  filter: "drop-shadow(0px 0px 20px #4a8cff50)",
                }}
              />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">Passkey Cüzdana Hoş Geldin</h2>
              <p className="text-[#94a3b8] text-center text-sm sm:text-base mb-8">
                Güvenli ve kolay kullanımlı web3 cüzdanınıza giriş yapın
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#4a8cff] hover:bg-[#3a7ae8] text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-[#4a8cff30] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:transform active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Giriş Yapılıyor...</span>
                  </>
                ) : (
                  <span>Passkey ile Giriş Yap</span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Login sonrası görünüm
        <div className="min-h-screen p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8 bg-[#1a2744] p-4 rounded-xl border border-[#233154]">
              <div className="flex items-center space-x-4">
                <Image
                  src={thirdwebIcon}
                  alt="Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
                <h1 className="text-lg sm:text-xl font-semibold text-white">Passkey Cüzdan</h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 sm:flex-none text-[#94a3b8] px-3 sm:px-4 py-2 bg-[#233154] rounded-lg hover:bg-[#2c3b64] transition-colors relative group text-sm sm:text-base"
                >
                  {account?.address?.slice(0, 4)}...{account?.address?.slice(-4)}
                  <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[#4a8cff] text-white text-xs sm:text-sm rounded transition-opacity ${
                    copySuccess ? 'opacity-100' : 'opacity-0'
                  }`}>
                    Kopyalandı!
                  </span>
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#233154] hover:bg-[#2c3b64] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Çıkış Yapılıyor...</span>
                    </>
                  ) : (
                    <span>Çıkış Yap</span>
                  )}
                </button>
              </div>
            </header>

            {/* Ana İçerik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Bakiye Kartı */}
              <div className="bg-[#1a2744] p-4 sm:p-6 rounded-xl border border-[#233154] shadow-lg">
                <h2 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">Bakiye</h2>
                <div className="text-2xl sm:text-3xl font-bold text-[#4a8cff]">0.00 ETH</div>
                <p className="text-[#94a3b8] mt-2 text-sm sm:text-base">≈ $0.00 USD</p>
              </div>

              {/* İşlemler Kartı */}
              <div className="bg-[#1a2744] p-4 sm:p-6 rounded-xl border border-[#233154] shadow-lg">
                <h2 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">Son İşlemler</h2>
                <div className="text-[#94a3b8] text-center py-6 sm:py-8 text-sm sm:text-base">
                  Henüz işlem bulunmuyor
                </div>
              </div>

              {/* NFT Kartı */}
              <div className="bg-[#1a2744] p-4 sm:p-6 rounded-xl border border-[#233154] shadow-lg">
                <h2 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">NFT Koleksiyonu</h2>
                <div className="text-[#94a3b8] text-center py-6 sm:py-8 text-sm sm:text-base">
                  Henüz NFT bulunmuyor
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
