
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Customers from "@/components/Customers";  
import Register from "@/components/Register";
import Earn from "@/components/Earn";
import Redeem from "@/components/Redeem";
import Campaigns from "@/components/Campaigns";
import Transactions from "@/components/Transactions";
import Settings from "@/components/Settings";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/register" element={<Register />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/redeem" element={<Redeem />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </div>
  );
};

export default Index;
