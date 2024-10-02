"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface DataContextType {
  data: any; // Define the type according to the API response, currently 'any'
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: any) => void;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create the provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);




  return (
    <DataContext.Provider value={{ data, loading, error, setData, setLoading, setError }}>
      {children}
    </DataContext.Provider>
  );
};


export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
