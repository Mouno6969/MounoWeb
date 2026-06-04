import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { History, Clock, CheckCircle, ExternalLink } from 'lucide-react';

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState<any>({ completed: [], pending: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrderData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: any = {
      'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
      'pending': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'failed': 'bg-red-500/10 text-red-500 border-red-500/20',
      'waiting_payment': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold border ${colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <History className="text-primary" /> {t('orders')}
        </h1>
        <p className="text-gray-400">View and track your previous crypto purchases.</p>
      </section>

      {/* Pending Orders */}
      {orderData.pending.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-500">
            <Clock size={20} /> {t('pending_orders')}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {orderData.pending.map((order: any) => (
              <div key={order.trx_id} className="card border-yellow-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="font-bold">{order.order_id}</p>
                    <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                   <div className="text-right">
                     <p className="font-bold text-lg">৳{order.amount_bdt}</p>
                     <p className="text-sm text-primary">{order.amount_usdc} USDC ({order.network})</p>
                   </div>
                   <StatusBadge status="pending" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Orders */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-green-500">
          <CheckCircle size={20} /> {t('completed_orders')}
        </h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading orders...</div>
        ) : orderData.completed.length === 0 ? (
          <div className="card text-center py-10 text-gray-500">No completed orders found.</div>
        ) : (
          <div className="overflow-x-auto card p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Network</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orderData.completed.map((order: any) => (
                  <tr key={order.trx_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm">{order.order_id}</td>
                    <td className="p-4 uppercase text-xs font-bold">{order.network}</td>
                    <td className="p-4">
                      <div className="font-bold">৳{order.amount_bdt}</div>
                      <div className="text-xs text-primary">{order.amount_usdc} USDC</div>
                    </td>
                    <td className="p-4"><StatusBadge status={order.status} /></td>
                    <td className="p-4 text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button className="p-2 hover:bg-accent rounded-lg transition-colors text-primary">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;
