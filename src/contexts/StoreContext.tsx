
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeApi } from '../services/api';

interface StoreDetails {
  name: string;
  phone: string;
  address: string;
}

interface StoreContextType {
  storeDetails: StoreDetails | null;
  updateStoreDetails: (details: StoreDetails) => Promise<void>;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStoreDetails = async () => {
    try {
      const response = await storeApi.getStore();
      setStoreDetails(response.data.data);
    } catch (error) {
      console.error('Failed to fetch store details:', error);
      // Set default store details for development
      setStoreDetails({
        name: 'Sample Store',
        phone: '055-123-4567',
        address: '123 Main Street, City'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStoreDetails = async (details: StoreDetails) => {
    try {
      await storeApi.updateStore(details);
      setStoreDetails(details);
    } catch (error) {
      console.error('Failed to update store details:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, []);

  return (
    <StoreContext.Provider value={{ storeDetails, updateStoreDetails, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
