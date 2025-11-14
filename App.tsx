import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chats from './pages/Chats';
import DataOnboarding from './pages/DataOnboarding';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* App routes with sidebar layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Dashboard />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/data-onboarding" element={<DataOnboarding />} />
        <Route path="/integrations" element={<Navigate to="/data-onboarding" replace />} />
        <Route path="/documents" element={<Navigate to="/data-onboarding" replace />} />
      </Route>
      
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;