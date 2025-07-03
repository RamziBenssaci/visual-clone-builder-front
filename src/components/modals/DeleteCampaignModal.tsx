
interface Campaign {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  earnRate: string;
  redeemRate: string;
  status: 'Active' | 'Expired';
}

interface DeleteCampaignModalProps {
  campaign: Campaign;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteCampaignModal = ({ campaign, onConfirm, onCancel }: DeleteCampaignModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Delete Campaign</h3>
        
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-gray-800 mb-2">Campaign Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Name: {campaign.name}</div>
            <div>Period: {campaign.startDate} - {campaign.endDate}</div>
            <div>Status: {campaign.status}</div>
            <div>Earn Rate: {campaign.earnRate}</div>
            <div>Redeem Rate: {campaign.redeemRate}</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCampaignModal;
