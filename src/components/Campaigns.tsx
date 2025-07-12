import { useState, useEffect } from "react";
import { Star, Plus, Edit, Trash2 } from "lucide-react";
import { campaignApi } from "../services/api";
import EditCampaignModal from "./modals/EditCampaignModal";
import DeleteCampaignModal from "./modals/DeleteCampaignModal";
import AddCampaignModal from "./modals/AddCampaignModal";

interface Campaign {
  id: number;
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

const Campaigns = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignApi.getAll();
      setCampaigns(response.data.data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      setCampaigns([
        {
          id: 1,
          name: "Winter Golden Campaign",
          description: "Earn double points during winter season",
          startDate: "1/1/2024",
          endDate: "3/31/2024",
          earnDollars: "100",
          earnPoints: "200",
          redeemPoints: "100",
          redeemDollars: "5",
          status: "Expired"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowEditModal(true);
  };

  const handleDelete = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const handleSaveCampaign = async (updatedCampaign: Campaign) => {
    console.log("Sending to API:", updatedCampaign);
    try {
      await campaignApi.update(updatedCampaign.id, updatedCampaign);
      setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
      setShowEditModal(false);
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleAddCampaign = async (newCampaign: Omit<Campaign, 'id'>) => {
    try {
      const response = await campaignApi.create(newCampaign);
      setCampaigns([...campaigns, response.data.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleDeleteCampaign = async () => {
    if (selectedCampaign) {
      try {
        await campaignApi.delete(selectedCampaign.id);
        setCampaigns(campaigns.filter(c => c.id !== selectedCampaign.id));
        setShowDeleteModal(false);
        setSelectedCampaign(null);
      } catch (error) {
        console.error('Failed to delete campaign:', error);
      }
    }
  };
useEffect(() => {
  const cookies = document.cookie.split(';').reduce((acc, curr) => {
    const [key, value] = curr.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  if (!cookies.admin_id_plain) {
    window.location.replace('https://test.freedomprocessing3.com/');
  }
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-800">Campaign Management</h2>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Campaign Management</h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 lg:p-6 rounded-b-lg shadow-sm">
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No campaigns found. Create your first campaign!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800 break-words">{campaign.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${
                        campaign.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 break-words">{campaign.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span className="break-words">{campaign.startDate} - {campaign.endDate}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                        <span><strong>Earn:</strong> {campaign.earnDollars}$ ➜ {campaign.earnPoints} pts</span>
                        <span><strong>Redeem:</strong> {campaign.redeemPoints} pts ➜ {campaign.redeemDollars}$</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 lg:ml-4 justify-end">
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
