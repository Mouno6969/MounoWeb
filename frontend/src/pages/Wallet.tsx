import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Wallet, Key, Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const MyWallet: React.FC = () => {
  const { t } = useTranslation();
  const [privateKey, setPrivateKey] = useState(localStorage.getItem('mouno_private_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(!!localStorage.getItem('mouno_private_key'));

  const saveKey = () => {
    localStorage.setItem('mouno_private_key', privateKey);
    setIsSaved(true);
    alert('Wallet saved to local storage!');
  };

  const removeKey = () => {
    if (window.confirm('Are you sure? Your private key will be removed from this browser.')) {
      localStorage.removeItem('mouno_private_key');
      setPrivateKey('');
      setIsSaved(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Wallet className="text-primary" /> {t('wallet')}
        </h1>
        <p className="text-gray-400">Connect your personal wallet for In-Bot Swaps and Transactions.</p>
      </section>

      <div className="card space-y-6">
        <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500">
           <AlertTriangle size={24} className="shrink-0" />
           <p className="text-sm">
             <b>Security Warning:</b> Your private key is stored <b>ONLY</b> in your browser's local storage. Never share your private key with anyone. We never send it to our servers.
           </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Key size={16} /> Private Key (EVM/Solana)
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                className="input-field pr-12 font-mono"
                placeholder="Enter your private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            {!isSaved ? (
              <button onClick={saveKey} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Shield size={20} /> Save Wallet
              </button>
            ) : (
              <button onClick={removeKey} className="bg-red-900/30 text-red-500 font-bold py-3 px-6 rounded-lg flex-1 border border-red-500/50 hover:bg-red-900/50 transition-all">
                Remove Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold mb-2">Supported Networks</h3>
          <p className="text-sm text-gray-400">Ethereum, BSC, Polygon, Avalanche, Base, Arbitrum, Solana.</p>
        </div>
        <div className="card">
          <h3 className="font-bold mb-2">In-Bot Execution</h3>
          <p className="text-sm text-gray-400">Your wallet allows the bot to sign transactions on your behalf securely.</p>
        </div>
      </div>
    </div>
  );
};

export default MyWallet;
