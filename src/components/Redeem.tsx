import { useState, useEffect } from "react";
import { Gift, Search, Check } from "lucide-react";
import { pointsApi } from "../services/api";

const Redeem = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState("");
  const [cashValue, setCashValue] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handlePreviewRedeem = async (points) => {
    if (!points) return;
    try {
      const preview = await pointsApi.redeemPreview({ points: parseInt(points) });
      setCashValue(parseFloat(preview.data.data.cashValue));
    } catch (e) {
      console.error("Preview failed", e);
      setCashValue(0);
    }
  };

  useEffect(() => {
    if (redeemPoints) handlePreviewRedeem(redeemPoints);
    else setCashValue(0);
  }, [redeemPoints]);

  const handleRedeemPoints = async () => {
    if (!foundCustomer || !redeemPoints) return;
    const pointsToRedeem = parseInt(redeemPoints);
    if (pointsToRedeem > foundCustomer.points) {
      alert("Insufficient points!");
      return;
    }
    setIsProcessing(true);
    try {
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
      }, 3000);
    } catch (error) {
      console.error("Failed to redeem points:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {/* same UI code here ... just replace $calc with cashValue */}
      {redeemPoints && (
        <p className="text-sm text-gray-600 mt-1">
          Cash value: ${cashValue.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default Redeem;
