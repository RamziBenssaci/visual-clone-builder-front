
import { useState } from "react";
import { CreditCard, Search, Trash2 } from "lucide-react";

interface Transaction {
  id: number;
  customerName: string;
  customerId: string;
  type: 'earned' | 'redeemed';
  points: number;
  amount: string;
  date: string;
}

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Transactions");

  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      customerName: "Ahmed Mohammed",
      customerId: "#1",
      type: "earned",
      points: 250,
      amount: "$500",
      date: "7/3/2025"
    },
    {
      id: 2,
      customerName: "Sarah Wilson",
      customerId: "#2",
      type: "redeemed",
      points: -500,
      amount: "$25",
      date: "7/3/2025"
    }
  ]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.customerId.includes(searchTerm)
  );

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
      <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
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
          className="ml-4 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option>All Transactions</option>
          <option>Points Earned</option>
          <option>Points Redeemed</option>
        </select>
      </div>

      {/* Transactions List */}
      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'earned' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'earned' ? (
                    <span className="text-green-600 text-lg">🏆</span>
                  ) : (
                    <span className="text-blue-600 text-lg">🎁</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{transaction.customerName}</h4>
                  <p className="text-sm text-gray-600">
                    ID: {transaction.customerId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Points {transaction.type === 'earned' ? 'Earned' : 'Redeemed'} • {transaction.date} • {transaction.amount}
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
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">250</div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">500</div>
            <div className="text-sm text-gray-600">Points Redeemed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
