import { useState } from "react";
import { X } from "lucide-react";

interface Campaign {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  earnDollars: string;
  earnPoints: string;
  redeemPoints: string;
  redeemDollars: string;
  status: 'Active' | 'Expired';
}

interface AddCampaignModalProps {
  onSave: (campaign: Campaign) => void;
  onCancel: () => void;
}

const AddCampaignModal = ({ onSave, onCancel }: AddCampaignModalProps) => {
  const [formData, setFormData] = useState<Campaign>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    earnDollars: "",
    earnPoints: "",
    redeemPoints: "",
    redeemDollars: "",
    status: "Active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Campaign</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <inputField label="Campaign Name" value={formData.name} onChange={val => setFormData({ ...formData, name: val })} required />
            <textareaField label="Description" value={formData.description} onChange={val => setFormData({ ...formData, description: val })} />

            <div className="grid grid-cols-2 gap-4">
              <inputField label="Start Date" type="date" value={formData.startDate} onChange={val => setFormData({ ...formData, startDate: val })} required />
              <inputField label="End Date" type="date" value={formData.endDate} onChange={val => setFormData({ ...formData, endDate: val })} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <inputField label="Earn Dollars" value={formData.earnDollars} onChange={val => setFormData({ ...formData, earnDollars: val })} required />
              <inputField label="Earn Points" value={formData.earnPoints} onChange={val => setFormData({ ...formData, earnPoints: val })} required />
              <inputField label="Redeem Points" value={formData.redeemPoints} onChange={val => setFormData({ ...formData, redeemPoints: val })} required />
              <inputField label="Redeem Dollars" value={formData.redeemDollars} onChange={val => setFormData({ ...formData, redeemDollars: val })} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Expired' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCampaignModal;

const inputField = ({ label, value, onChange, type = "text", required = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required={required}
    />
  </div>
);

const textareaField = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);
