
import { useState } from "react";
import { Minus, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Remove = () => {
  const [searchPhone, setSearchPhone] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deductionComplete, setDeductionComplete] = useState(false);

  const handleSearchCustomer = () => {
    if (searchPhone) {
      // Mock customer data
      setFoundCustomer({
        name: "Ahmed Mohammed",
        phone: searchPhone,
        currentPoints: 1250,
        lastTransaction: "$75.00",
        transactionDate: "2024-01-15",
        tier: "Gold"
      });
    }
  };

  const handleDeductPoints = () => {
    if (refundAmount && foundCustomer) {
      const pointsToDeduct = Math.floor(parseFloat(refundAmount) * 5); // 5 points per dollar
      setShowConfirmation(true);
    }
  };

  const confirmDeduction = () => {
    setDeductionComplete(true);
    setShowConfirmation(false);
    setTimeout(() => {
      setDeductionComplete(false);
      setFoundCustomer(null);
      setSearchPhone("");
      setRefundAmount("");
    }, 3000);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Minus className="w-5 h-5 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Remove Points</h2>
      </div>

      {/* Remove Points Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Minus className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Point Deduction (Refund Handling)</h3>
        </div>
      </div>

      {/* Search and Deduction Form */}
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
                <Button onClick={handleSearchCustomer} className="w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  Search
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
                  <p className="text-sm text-blue-700">Current Points: {foundCustomer.currentPoints}</p>
                  <p className="text-sm text-blue-700">Last Transaction: {foundCustomer.lastTransaction}</p>
                  <p className="text-sm text-blue-700">Date: {foundCustomer.transactionDate}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
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
                {refundAmount && (
                  <p className="text-sm text-gray-600 mt-1">
                    Points to deduct: {Math.floor(parseFloat(refundAmount) * 5)} points
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDeductPoints} disabled={!refundAmount}>
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
              <p className="text-yellow-800">Points to Deduct: {Math.floor(parseFloat(refundAmount) * 5)} points</p>
              <p className="text-yellow-800">Remaining Points: {foundCustomer.currentPoints - Math.floor(parseFloat(refundAmount) * 5)} points</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={confirmDeduction} className="bg-red-600 hover:bg-red-700">
                <Check className="w-4 h-4 mr-2" />
                Confirm Deduction
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
