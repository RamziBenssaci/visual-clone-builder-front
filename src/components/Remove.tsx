import { useState, useEffect } from "react";
import { Minus, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pointsApi, campaignApi } from "../services/api";

const Remove = () => {
  const [searchPhone, setSearchPhone] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deductionComplete, setDeductionComplete] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await campaignApi.getAll();
        setCampaigns(res.data.data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };
    fetchCampaigns();
  }, []);

  const handleSearchCustomer = async () => {
    if (!searchPhone.trim()) return;

    setIsSearching(true);
    try {
      const response = await pointsApi.searchCustomer(searchPhone);
      setFoundCustomer(response.data.data);
    } catch (error) {
      console.error("Customer search failed:", error);
      setFoundCustomer(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeductPoints = () => {
    if (refundAmount && foundCustomer && selectedCampaignId) {
      const campaign = campaigns.find(c => c.id === parseInt(selectedCampaignId));
      const pointsToDeduct = Math.floor(parseFloat(refundAmount) * (campaign?.earnPoints / campaign?.earnDollars || 2));
      setShowConfirmation(true);
    }
  };

  const confirmDeduction = async () => {
    setIsProcessing(true);
    try {
      const deductData = {
        customerId: foundCustomer.id,
        refundAmount: parseFloat(refundAmount),
        reason: "Product return refund",
        campaignId: selectedCampaignId
      };

      await pointsApi.deduct(deductData);

      setDeductionComplete(true);
      setShowConfirmation(false);
      setTimeout(() => {
        setDeductionComplete(false);
        setFoundCustomer(null);
        setSearchPhone("");
        setRefundAmount("");
        setSelectedCampaignId(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to deduct points:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Minus className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Remove Points</h2>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Minus className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Point Deduction (Refund Handling)</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        {!foundCustomer && !deductionComplete && (
          <div className="space-y-4">
            <div className="max-w-md mx-auto lg:mx-0">
              <Label htmlFor="phone-search">Customer Phone Number</Label>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-1">
                <Input
                  id="phone-search"
                  type="tel"
                  placeholder="Enter phone number"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearchCustomer}
                  disabled={isSearching || !searchPhone.trim()}
                  className="w-full sm:w-auto"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {foundCustomer && !showConfirmation && !deductionComplete && (
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
                  <p className="text-sm text-blue-700">Current Points: {foundCustomer.points}</p>
                  <p className="text-sm text-blue-700">Cash Value: {foundCustomer.cashValue}</p>
                  <p className="text-sm text-blue-700">Member Since: {foundCustomer.joined}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-select">Select Campaign</Label>
                <select
                  id="campaign-select"
                  value={selectedCampaignId || ''}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled>Select a campaign</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.earnPoints} pts / ${c.earnDollars})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="refund-amount">Refund Amount ($)</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter refund amount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="max-w-xs"
                />
                {refundAmount && selectedCampaignId && (
                  <p className="text-sm text-gray-600 mt-1">
                    Points to deduct: {
                      Math.floor(
                        parseFloat(refundAmount) * (
                          (campaigns.find(c => c.id === parseInt(selectedCampaignId))?.earnPoints || 2) /
                          (campaigns.find(c => c.id === parseInt(selectedCampaignId))?.earnDollars || 1)
                        )
                      )
                    } points
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDeductPoints} disabled={!refundAmount || !selectedCampaignId}>
                  Deduct Points
                </Button>
                <Button variant="outline" onClick={() => setFoundCustomer(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Minus className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-yellow-900">Confirm Point Deduction</h3>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-yellow-800">Customer: {foundCustomer.name}</p>
              <p className="text-yellow-800">Refund Amount: ${refundAmount}</p>
              <p className="text-yellow-800">Points to Deduct: {Math.floor(parseFloat(refundAmount) * 2)} points</p>
              <p className="text-yellow-800">Remaining Points: {foundCustomer.points - Math.floor(parseFloat(refundAmount) * 2)} points</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={confirmDeduction} 
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                <Check className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Confirm Deduction'}
              </Button>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {deductionComplete && (
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Points Successfully Deducted</h3>
                <p className="text-green-800">The customer has been notified of the point deduction.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Remove;
