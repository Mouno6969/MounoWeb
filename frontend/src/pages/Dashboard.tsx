import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Battery, Wallet, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [marketData, setMarketData] = useState<any>(null);

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

  const networks = [
    { id: 'solana', name: 'Solana (SOL)', icon: '🪐' },
    { id: 'trc20', name: 'Tron (TRC20)', icon: '🔋' },
    { id: 'polygon', name: 'Polygon (MATIC)', icon: '🟣' },
    { id: 'bsc', name: 'BSC (BNB)', icon: '🟡' },
    { id: 'ton', name: 'TON', icon: '💎' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('welcome')}, {user ? user.username : 'Guest'}!</h1>
        <p className="text-gray-400">Manage your crypto assets across all major networks.</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t('rates')}</p>
            <p className="text-xl font-bold">৳{marketData?.rates?.solana || '...'}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Status</p>
            <p className="text-xl font-bold">Online</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Account</p>
            <p className="text-xl font-bold">{user ? 'Verified' : 'Guest'}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-lg">
            <Battery size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Stock</p>
            <p className="text-xl font-bold">High</p>
          </div>
        </div>
      </div>

      {/* Market Table */}
      <section className="card overflow-hidden">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="text-primary" /> {t('rates')}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="pb-4 font-medium">Network</th>
                <th className="pb-4 font-medium text-right">Rate (1 USDT/USDC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {networks.map((net) => (
                <tr key={net.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 flex items-center gap-3">
                    <span className="text-2xl">{net.icon}</span>
                    <span className="font-medium group-hover:text-primary transition-colors">{net.name}</span>
                  </td>
                  <td className="py-4 text-right font-mono font-bold text-lg">
                    ৳{marketData?.rates?.[net.id] || marketData?.rates?.solana || '...'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-primary text-secondary">
          <h3 className="text-2xl font-bold mb-2">{t('buy')}</h3>
          <p className="mb-6 opacity-80">Quickly purchase USDC or USDT using bKash at the best market rates.</p>
          <a href="/buy" className="inline-block bg-secondary text-white font-bold py-3 px-8 rounded-xl hover:bg-black/80 transition-colors">
            {t('buy')}
          </a>
        </div>
        <div className="card bg-accent border-primary/30">
          <h3 className="text-2xl font-bold mb-2 text-primary">{t('swap')}</h3>
          <p className="mb-6 text-gray-400">Bridge and Swap assets between 20+ chains using LI.FI.</p>
          <a href="/swap" className="inline-block bg-primary text-secondary font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-colors">
            {t('swap')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
