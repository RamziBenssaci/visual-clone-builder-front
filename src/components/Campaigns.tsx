
import { useState } from "react";
import { Star, Plus, Edit, Trash2 } from "lucide-react";
import EditCampaignModal from "./modals/EditCampaignModal";
import DeleteCampaignModal from "./modals/DeleteCampaignModal";
import AddCampaignModal from "./modals/AddCampaignModal";

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

const Campaigns = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "Winter Golden Campaign",
      description: "Earn double points during winter season",
      startDate: "1/1/2024",
      endDate: "3/31/2024",
      earnRate: "2x points/$",
      redeemRate: "$0.05/point",
      status: "Expired"
    }
  ]);

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowEditModal(true);
  };

  const handleDelete = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const handleSaveCampaign = (updatedCampaign: Campaign) => {
    setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    setShowEditModal(false);
    setSelectedCampaign(null);
  };

  const handleAddCampaign = (newCampaign: Omit<Campaign, 'id'>) => {
    const campaign: Campaign = {
      ...newCampaign,
      id: Math.max(...campaigns.map(c => c.id), 0) + 1
    };
    setCampaigns([...campaigns, campaign]);
    setShowAddModal(false);
  };

  const handleDeleteCampaign = () => {
    if (selectedCampaign) {
      setCampaigns(campaigns.filter(c => c.id !== selectedCampaign.id));
      setShowDeleteModal(false);
      setSelectedCampaign(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">Campaign Management</h2>
        </div>
      </div>

      {/* Campaign Management Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Campaign Management</h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No campaigns found. Create your first campaign!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{campaign.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        campaign.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{campaign.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>{campaign.startDate} - {campaign.endDate}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span><strong>Earn:</strong> {campaign.earnRate}</span>
                        <span><strong>Redeem:</strong> {campaign.redeemRate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCampaignModal
          onSave={handleAddCampaign}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && selectedCampaign && (
        <EditCampaignModal
          campaign={selectedCampaign}
          onSave={handleSaveCampaign}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedCampaign(null);
          }}
        />
      )}

      {showDeleteModal && selectedCampaign && (
        <DeleteCampaignModal
          campaign={selectedCampaign}
          onConfirm={handleDeleteCampaign}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedCampaign(null);
          }}
        />
      )}
    </div>
  );
};

export default Campaigns;
