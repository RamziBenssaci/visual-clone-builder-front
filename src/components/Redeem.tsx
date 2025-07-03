
import { useState } from "react";
import { Gift, Search } from "lucide-react";

const Redeem = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSearch = () => {
    console.log("Searching for customer:", phoneNumber);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Gift className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Redeem Points</h2>
      </div>

      {/* Redeem Points Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Gift className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Redeem Points</h3>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        <div className="max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Phone Number
            </label>
            <div className="flex space-x-3">
              <input
                type="tel"
                placeholder="05xxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Redeem;
