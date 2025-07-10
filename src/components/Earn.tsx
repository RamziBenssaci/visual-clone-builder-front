import { useState, useEffect } from "react";
import { Award, Search, Users, Check } from "lucide-react";
import { pointsApi } from "../services/api";
import { campaignApi } from "../services/api";

const Earn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [previewPoints, setPreviewPoints] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (!purchaseAmount || !selectedCampaignId) {
        setPreviewPoints(null);
        return;
      }

      const campaign = campaigns.find(c => c.id === parseInt(selectedCampaignId));
      if (!campaign) return;

      const earnRate = campaign.earnPoints / Math.max(campaign.earnDollars, 0.0001);
      const preview = parseFloat(purchaseAmount) * earnRate;
      setPreviewPoints(Math.floor(preview));
    };

    fetchPreview();
  }, [purchaseAmount, selectedCampaignId, campaigns]);

  const handleSearch = async () => {
    if (!phoneNumber.trim()) return;
    setIsSearching(true);
    try {
      const response = await pointsApi.searchCustomer(phoneNumber);
      setFoundCustomer(response.data.data);

const campaignsRes = await campaignApi.getAll();
      setCampaigns(campaignsRes.data.data);
    } catch (error) {
      console.error("Customer search failed:", error);
      setFoundCustomer(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEarnPoints = async () => {
    if (!foundCustomer || !purchaseAmount || !selectedCampaignId) return;

    setIsProcessing(true);
    try {
      const earnData = {
        customerId: foundCustomer.id,
        amount: parseFloat(purchaseAmount),
        description: "Purchase reward",
        campaignId: selectedCampaignId
      };

      const response = await pointsApi.earn(earnData);
      const { transaction, customer } = response.data.data;

      setFoundCustomer(customer);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setFoundCustomer(null);
        setPhoneNumber("");
        setPurchaseAmount("");
        setPreviewPoints(null);
        setSelectedCampaignId(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to earn points:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Award className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Earn Points</h2>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Add Points to Customer</h3>
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
                <span>{isSearching ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </div>
        )}

        {foundCustomer && !showSuccess && (
          <div className="space-y-6 max-w-2xl mx-auto lg:mx-0">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Customer Found</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-700">Name: {foundCustomer.name}</p>
                  <p className="text-sm text-green-700">Phone: {foundCustomer.phone}</p>
                  <p className="text-sm text-green-700">Tier: {foundCustomer.tier}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Current Points: {foundCustomer.points.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Cash Value: {foundCustomer.cashValue}</p>
                  <p className="text-sm text-green-700">Member Since: {foundCustomer.joined}</p>
                </div>
              </div>
            </div>

           <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Select Campaign
  </label>
  <div className="grid sm:grid-cols-2 gap-4">
    {campaigns.map((campaign) => {
      const isSelected = parseInt(selectedCampaignId) === campaign.id;
      return (
        <div
          key={campaign.id}
          onClick={() => setSelectedCampaignId(campaign.id)}
          className={`cursor-pointer border rounded-lg p-4 transition-all shadow-sm hover:shadow-md ${
            isSelected
              ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-50'
              : 'border-gray-200'
          }`}
        >
          <h4 className="text-md font-semibold text-gray-800 mb-1">
            {campaign.name}
          </h4>
          <p className="text-sm text-gray-600 mb-1">
            {campaign.description}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{campaign.earnPoints}</span> points per <span className="font-medium">${campaign.earnDollars}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {campaign.startDate} - {campaign.endDate}
          </p>
        </div>
      );
    })}
  </div>
</div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter purchase amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {previewPoints !== null && (
                <p className="text-sm text-gray-600 mt-1">
                  Points to earn: {previewPoints} points
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleEarnPoints}
                  disabled={isProcessing || !purchaseAmount || !selectedCampaignId}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Add Points'}
                </button>
                <button
                  onClick={() => {
                    setFoundCustomer(null);
                    setPurchaseAmount("");
                    setPreviewPoints(null);
                    setSelectedCampaignId(null);
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
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
                <h3 className="font-semibold text-green-900">Points Added Successfully!</h3>
                <p className="text-green-800">Points were added to the customer’s account.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Earn;
