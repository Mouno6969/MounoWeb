import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Smartphone, CheckCircle, Info } from 'lucide-react';

const Buy: React.FC = () => {
  const { t } = useTranslation();
  const [networks] = useState([
    { id: 'solana', name: 'Solana (USDC)', icon: '🪐' },
    { id: 'trc20', name: 'Tron (USDT)', icon: '🔋' },
    { id: 'polygon', name: 'Polygon (USDC)', icon: '🟣' },
    { id: 'bsc', name: 'BSC (USDT)', icon: '🟡' },
    { id: 'ton', name: 'TON (USDT)', icon: '💎' },
  ]);

  const [selectedNetwork, setSelectedNetwork] = useState('solana');
  const [bdtAmount, setBdtAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('0');
  const [wallet, setWallet] = useState('');
  const [trxId, setTrxId] = useState('');
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await axios.get('/api/market');
        setMarketData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMarket();
  }, []);

  const handleBdtChange = (val: string) => {
    setBdtAmount(val);
    const rate = marketData?.rates?.[selectedNetwork] || 137;
    const crypto = val ? (parseFloat(val) / rate).toFixed(2) : '0';
    setCryptoAmount(crypto);
  };

  const handleNetworkChange = (id: string) => {
    setSelectedNetwork(id);
    const rate = marketData?.rates?.[id] || 137;
    const crypto = bdtAmount ? (parseFloat(bdtAmount) / rate).toFixed(2) : '0';
    setCryptoAmount(crypto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/buy', {
        amount_bdt: bdtAmount,
        network: selectedNetwork,
        wallet,
        trx_id: trxId
      });
      setSuccess(res.data.order_id);
      setBdtAmount('');
      setCryptoAmount('0');
      setWallet('');
      setTrxId('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Order Submitted Successfully!</h2>
        <p className="text-gray-400 mb-8 text-lg">Your Order ID is: <span className="text-primary font-mono font-bold">{success}</span>. It will be processed automatically within a few minutes.</p>
        <button onClick={() => setSuccess(null)} className="btn-primary">Buy More</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ShoppingCart className="text-primary" /> {t('buy')}
        </h1>
        <p className="text-gray-400">Step-by-step crypto purchase via bKash.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* Network Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-400">{t('network')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {networks.map((net) => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => handleNetworkChange(net.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      selectedNetwork === net.id 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-gray-700 bg-secondary hover:border-gray-500'
                    }`}
                  >
                    <span className="text-2xl">{net.icon}</span>
                    <span className="text-xs font-bold uppercase">{net.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('bdt_amount')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">৳</span>
                  <input
                    type="number"
                    className="input-field pl-10"
                    placeholder="Min 500"
                    value={bdtAmount}
                    onChange={(e) => handleBdtChange(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('crypto_amount')}</label>
                <div className="bg-secondary border border-gray-700 rounded-lg p-3 text-xl font-bold flex justify-between items-center h-[50px]">
                  <span>{cryptoAmount}</span>
                  <span className="text-sm text-primary uppercase">{selectedNetwork === 'trc20' || selectedNetwork === 'bsc' || selectedNetwork === 'ton' ? 'USDT' : 'USDC'}</span>
                </div>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">{t('wallet_address')}</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your wallet address"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                required
              />
            </div>

            {/* bKash Payment Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
               <div className="flex items-center gap-2 text-primary font-bold">
                 <Smartphone size={20} />
                 <span>{t('send_bdt')}</span>
               </div>
               <div className="text-2xl font-mono font-bold tracking-widest bg-black/30 p-3 rounded-lg text-center">
                 {marketData?.bKash || '01XXXXXXXXX'}
               </div>
               <p className="text-sm text-gray-400 text-center italic">{t('after_payment')}</p>
            </div>

            {/* TrxID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">{t('trx_id')}</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. BMA1234567"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
              {loading ? 'Processing...' : t('submit_order')}
            </button>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="card border-blue-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="text-blue-400" size={20} /> Instructions
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="bg-blue-500/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span>
                <span>Select your preferred network and enter the BDT amount.</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-blue-500/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span>
                <span>Send the exact BDT amount via bKash (Send Money or Cash In) to the provided number.</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-blue-500/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">3</span>
                <span>Copy the Transaction ID (TrxID) from bKash confirmation SMS/App.</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-blue-500/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">4</span>
                <span>Paste the TrxID and your Wallet Address here, then Submit.</span>
              </li>
            </ul>
          </div>

          <div className="card">
             <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase">Market Rate</h3>
             <p className="text-3xl font-bold">৳{marketData?.rates?.[selectedNetwork] || '...'}</p>
             <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
               <TrendingUp size={12} /> Best rate guaranteed
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock TrendingUp since I used it but didn't import it correctly above
const TrendingUp = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default Buy;
