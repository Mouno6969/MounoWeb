import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { RefreshCw, ArrowRight, Settings, Info } from 'lucide-react';

const Swap: React.FC = () => {
  const { t } = useTranslation();
  const [fromChain, setFromChain] = useState('1'); // Ethereum
  const [toChain, setToChain] = useState('137'); // Polygon
  const [fromToken, setFromToken] = useState('0x0000000000000000000000000000000000000000'); // ETH
  const [toToken, setToToken] = useState('0x2791bca1f2de4661ed88a30c99a7a9449aa84174'); // USDC
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getQuote = async () => {
    if (!amount) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/swap/quote`, {
        params: { fromChain, toChain, fromToken, toToken, amount }
      });
      setQuote(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to get quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <RefreshCw className="text-primary" /> {t('swap')}
        </h1>
        <p className="text-gray-400">Bridge and Swap assets across 20+ networks via LI.FI.</p>
      </section>

      <div className="card space-y-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Cross-Chain Swap</span>
          <Settings size={20} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
        </div>

        {/* From */}
        <div className="space-y-2 bg-secondary p-4 rounded-xl border border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>From</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <input
              type="number"
              className="bg-transparent text-3xl font-bold w-full focus:outline-none"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select 
              className="bg-accent p-2 rounded-lg font-bold"
              value={fromChain}
              onChange={(e) => setFromChain(e.target.value)}
            >
              <option value="1">ETH</option>
              <option value="56">BSC</option>
              <option value="137">POL</option>
              <option value="8453">BASE</option>
              <option value="43114">AVAX</option>
            </select>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center -my-8 z-10 relative">
          <div className="bg-accent border border-gray-700 p-2 rounded-full text-primary shadow-xl">
             <ArrowRight size={24} className="rotate-90" />
          </div>
        </div>

        {/* To */}
        <div className="space-y-2 bg-secondary p-4 rounded-xl border border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>To (Estimated)</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-3xl font-bold w-full text-gray-500">
              {quote ? quote.estimate?.toAmount : '0.0'}
            </div>
             <select 
              className="bg-accent p-2 rounded-lg font-bold"
              value={toChain}
              onChange={(e) => setToChain(e.target.value)}
            >
              <option value="137">POL</option>
              <option value="1">ETH</option>
              <option value="56">BSC</option>
              <option value="8453">BASE</option>
              <option value="43114">AVAX</option>
            </select>
          </div>
        </div>

        {quote && (
          <div className="space-y-2 text-sm text-gray-400 border-t border-gray-800 pt-4">
             <div className="flex justify-between">
               <span>Rate</span>
               <span className="text-white">1 {fromChain === '1' ? 'ETH' : 'BNB'} = {quote.estimate?.executionPrice} USDC</span>
             </div>
             <div className="flex justify-between">
               <span>Fees</span>
               <span className="text-white">${quote.estimate?.feeCosts?.[0]?.amountUsd || '0.00'}</span>
             </div>
          </div>
        )}

        <button 
          onClick={getQuote} 
          disabled={loading || !amount}
          className="btn-primary w-full text-lg mt-4"
        >
          {loading ? 'Finding Best Route...' : 'Get Quote'}
        </button>

        {quote && (
           <button className="w-full bg-white text-secondary font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
             Execute Swap In-Bot <RefreshCw size={20} />
           </button>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
         <Info className="text-blue-400 shrink-0" />
         <p className="text-sm text-gray-300">
           Liquidity is sourced from <b>LI.FI</b>, providing you the best rates from 1INCH, Paraswap, and OpenOcean across multiple bridges.
         </p>
      </div>
    </div>
  );
};

export default Swap;
