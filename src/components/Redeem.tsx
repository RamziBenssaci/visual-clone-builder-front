import { useState, useEffect } from "react";
import { Gift, Search, Check } from "lucide-react";
import { pointsApi } from "../services/api";

const Redeem = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState("");
  const [dynamicCashValue, setDynamicCashValue] = useState(null); // <-- new
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const preview = async () => {
      if (!redeemPoints || isNaN(redeemPoints)) return setDynamicCashValue(null);
      try {
        const response = await pointsApi.redeemPreview(parseInt(redeemPoints));
        setDynamicCashValue(response.data.data.cashValue);
      } catch (err) {
        setDynamicCashValue(null);
        console.error("Preview failed", err);
      }
    };
    preview();
  }, [redeemPoints]);

  const handleSearch = async () => {
    if (!phoneNumber.trim()) return;
    setIsSearching(true);
    try {
      const response = await pointsApi.searchCustomer(phoneNumber);
      setFoundCustomer(response.data.data);
    } catch (error) {
      console.error("Customer search failed:", error);
      setFoundCustomer(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (!foundCustomer || !redeemPoints) return;

    const pointsToRedeem = parseInt(redeemPoints);
    if (pointsToRedeem > foundCustomer.points) {
      alert("Insufficient points!");
      return;
    }

    setIsProcessing(true);
    try {
      const cashValue = dynamicCashValue ?? pointsToRedeem * 0.05;

      const redeemData = {
        customerId: foundCustomer.id,
        points: pointsToRedeem,
        cashValue: cashValue,
        description: "Cash redemption",
      };

      await pointsApi.redeem(redeemData);

      setFoundCustomer({
        ...foundCustomer,
        points: foundCustomer.points - pointsToRedeem,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFoundCustomer(null);
        setPhoneNumber("");
        setRedeemPoints("");
        setDynamicCashValue(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to redeem points:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* ...everything stays the same until preview text... */}
      {foundCustomer && !showSuccess && (
        <div className="space-y-4">
          <div>
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
            {redeemPoints && dynamicCashValue !== null && (
              <p className="text-sm text-gray-600 mt-1">
                Cash value: ${dynamicCashValue.toFixed(2)}
              </p>
            )}
          </div>
          {/* ...rest unchanged */}
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
                Customer redeemed {redeemPoints} points for ${dynamicCashValue?.toFixed(2) ?? "0.00"}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Redeem;
