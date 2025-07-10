import { useState, useEffect } from "react";
import { Gift, Search, Check } from "lucide-react";
import { pointsApi } from "../services/api";
import { campaignApi } from "../services/api";

const Redeem = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cashValue, setCashValue] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCashValue = async () => {
      if (
        !redeemPoints ||
        isNaN(redeemPoints) ||
        parseInt(redeemPoints) <= 0 ||
        !selectedCampaignId
      ) {
        setCashValue(null);
        return;
      }

      const campaign = campaigns.find(c => c.id === parseInt(selectedCampaignId));
      if (!campaign) return;

      const dollarPerPoint = campaign.redeemDollars / Math.max(campaign.redeemPoints, 0.0001);
      const value = parseInt(redeemPoints) * dollarPerPoint;
      setCashValue(value);
    };

    fetchCashValue();
  }, [redeemPoints, selectedCampaignId, campaigns]);

  const handleSearch = async () => {
    if (!phoneNumber.trim()) return;

    setIsSearching(true);
    try {
      const response = await pointsApi.searchCustomer(phoneNumber);
      setFoundCustomer(response.data.data);

      const campaignRes = await campaignApi.getAll();
      setCampaigns(campaignRes.data.data);
    } catch (error) {
      console.error("Customer search failed:", error);
      setFoundCustomer(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRedeemPoints = async () => {
    setErrorMsg("");

    if (!foundCustomer || !redeemPoints || !cashValue || !selectedCampaignId) return;

    const pointsToRedeem = parseInt(redeemPoints);
    if (pointsToRedeem > foundCustomer.points) {
      setErrorMsg(`You only have ${foundCustomer.points} points. Please enter a valid amount.`);
      return;
    }

    setIsProcessing(true);
    try {
      const redeemData = {
        customerId: foundCustomer.id,
        points: pointsToRedeem,
        cashValue: cashValue,
        description: "Cash redemption",
        campaignId: selectedCampaignId
      };

      await pointsApi.redeem(redeemData);

      setFoundCustomer({
        ...foundCustomer,
        points: foundCustomer.points - pointsToRedeem
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFoundCustomer(null);
        setPhoneNumber("");
        setRedeemPoints("");
        setCashValue(null);
        setSelectedCampaignId(null);
        setErrorMsg("");
      }, 3000);
    } catch (error) {
      console.error("Failed to redeem points:", error);
      setErrorMsg("An unexpected error occurred while redeeming points.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Gift className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Redeem Points</h2>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Gift className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Redeem Points</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        {!foundCustomer && !showSuccess && (
          <div className="max-w-md mx-auto lg:mx-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Phone Number
            </label>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="tel"
                placeholder="05xxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !phoneNumber.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? "Searching..." : "Search"}</span>
              </button>
            </div>
          </div>
        )}

        {foundCustomer && !showSuccess && (
          <div className="space-y-6 max-w-2xl mx-auto lg:mx-0">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Customer Found</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Name: {foundCustomer.name}</p>
                  <p className="text-sm text-blue-700">Phone: {foundCustomer.phone}</p>
                  <p className="text-sm text-blue-700">Tier: {foundCustomer.tier}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Available Points: {foundCustomer.points.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Cash Value: {foundCustomer.cashValue}</p>
                  <p className="text-sm text-blue-700">Member Since: {foundCustomer.joined}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Campaign</label>
              <div className="relative max-w-xs">
                <select
                  value={selectedCampaignId || ""}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition"
                >
                  <option value="" disabled>
                    Select a campaign
                  </option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.redeemPoints} pts / ${c.redeemDollars})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points to Redeem
              </label>
              <input
                type="number"
                placeholder="Enter points to redeem"
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
                max={foundCustomer.points}
                className="max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {redeemPoints && (
                <p className="text-sm text-gray-600 mt-1">
                  Cash value: {cashValue !== null ? `$${cashValue.toFixed(2)}` : "Loading..."}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleRedeemPoints}
                  disabled={isProcessing || !redeemPoints || !selectedCampaignId}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Redeem Points"}
                </button>
                <button
                  onClick={() => {
                    setFoundCustomer(null);
                    setCashValue(null);
                    setSelectedCampaignId(null);
                    setRedeemPoints("");
                    setErrorMsg("");
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {errorMsg && (
                <p className="text-sm text-red-600 mt-2 font-medium">{errorMsg}</p>
              )}
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Points Redeemed Successfully!</h3>
                <p className="text-green-800">
                  Customer redeemed {redeemPoints} points for ${cashValue?.toFixed(2)}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Redeem;
