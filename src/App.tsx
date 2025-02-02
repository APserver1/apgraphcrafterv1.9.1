import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ChartEditor } from './pages/ChartEditor';
import { Account } from './pages/Account';
import { Templates } from './pages/Templates';
import { TemplateDetails } from './pages/TemplateDetails';
import { Premium } from './pages/Premium';
import { Checkout } from './pages/Checkout';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { TermsOfService } from './pages/TermsOfService';
import { UserProfile } from './pages/UserProfile';
import { Studio } from './pages/Studio';
import { LandingPage } from './pages/LandingPage';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user } = useAuth();

  return (
    <div>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <ChartEditor /> : <LandingPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id" element={<TemplateDetails />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/checkout/:planId" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/studio" element={<Studio />} />
      </Routes>
    </div>
  );
}