
import { useState, useEffect } from "react";
import { CreditCard, Search, Trash2 } from "lucide-react";
import { transactionsApi } from "../services/api";

interface Transaction {
  id: number;
  customerName: string;
  customerId: string;
  type: 'earned' | 'redeemed' | 'deducted';
  points: number;
  amount: string;
  date: string;
  description?: string;
}

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Transactions");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    pointsEarned: 0,
    pointsRedeemed: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchTransactions();
    }
  }, [searchTerm]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filter === "Points Earned") params.type = 'earned';
      if (filter === "Points Redeemed") params.type = 'redeemed';
      
      const response = await transactionsApi.getAll(params);
      setTransactions(response.data.data);
      
      // Calculate stats
      const totalTransactions = response.data.data.length;
      const pointsEarned = response.data.data
        .filter((t: Transaction) => t.type === 'earned')
        .reduce((sum: number, t: Transaction) => sum + Math.abs(t.points), 0);
      const pointsRedeemed = response.data.data
        .filter((t: Transaction) => t.type === 'redeemed')
        .reduce((sum: number, t: Transaction) => sum + Math.abs(t.points), 0);
      
      setStats({ totalTransactions, pointsEarned, pointsRedeemed });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Fallback to mock data
      const mockTransactions = [
        {
          id: 1,
          customerName: "Ahmed Mohammed",
          customerId: "#1",
          type: "earned" as const,
          points: 250,
          amount: "$500",
          date: "7/3/2025"
        },
        {
          id: 2,
          customerName: "Sarah Wilson",
          customerId: "#2",
          type: "redeemed" as const,
          points: -500,
          amount: "$25",
          date: "7/3/2025"
        }
      ];
      setTransactions(mockTransactions);
      setStats({
        totalTransactions: 2,
        pointsEarned: 250,
        pointsRedeemed: 500
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchTransactions();
      return;
    }

    try {
      const params: any = { search: searchTerm };
      if (filter === "Points Earned") params.type = 'earned';
      if (filter === "Points Redeemed") params.type = 'redeemed';
      
      const response = await transactionsApi.getAll(params);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Transaction search failed:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      await transactionsApi.delete(transactionId);
      setTransactions(transactions.filter(t => t.id !== transactionId));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.customerId.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
      </div>

      {/* Transaction History Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Transaction History</h3>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by customer name or transaction ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="ml-0 sm:ml-4 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
        >
          <option>All Transactions</option>
          <option>Points Earned</option>
          <option>Points Redeemed</option>
        </select>
      </div>
  {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</div>
            <div className="text-sm text-gray-600">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.pointsEarned.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.pointsRedeemed.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Points Redeemed</div>
          </div>
        </div>
      {/* Transactions List */}
      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'earned' ? 'bg-green-100' : 
                  transaction.type === 'redeemed' ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'earned' ? (
                    <span className="text-green-600 text-lg">🏆</span>
                  ) : transaction.type === 'redeemed' ? (
                    <span className="text-blue-600 text-lg">🎁</span>
                  ) : (
                    <span className="text-red-600 text-lg">⚠️</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{transaction.customerName}</h4>
                  <p className="text-sm text-gray-600">
                    ID: {transaction.customerId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Points {transaction.type === 'earned' ? 'Earned' : transaction.type === 'redeemed' ? 'Redeemed' : 'Deducted'} • {transaction.date} • {transaction.amount}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`text-lg font-semibold ${
                  transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                  <span className="text-sm text-gray-500 ml-1">points</span>
                </div>
                <button 
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      
      </div>
    </div>
  );
};

export default Transactions;
