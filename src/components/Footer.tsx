
import { Phone, MapPin, Store } from "lucide-react";
import { useStore } from "../contexts/StoreContext";

const Footer = () => {
  const { storeDetails, loading } = useStore();

  if (loading || !storeDetails) {
    return null;
  }

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-gray-300" />
            <span className="font-semibold text-lg">{storeDetails.name}</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{storeDetails.phone}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{storeDetails.address}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-4 text-center text-xs text-gray-400">
          <p>&copy; 2025 {storeDetails.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
