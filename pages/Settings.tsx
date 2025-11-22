import React, { useState, useEffect } from 'react';
import { CreditCardIcon, CalendarIcon, CopyIcon, EyeIcon, EyeOffIcon, RefreshIcon } from '../components/icons/Icons';

const Settings: React.FC = () => {
  const [autoRenew, setAutoRenew] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [apiToken, setApiToken] = useState('');

  const fetchApiKey = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Access token not found');
      }
      const response = await fetch('https://api.nswebassistant.site/auth/tenant/api-key', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch API key');
      }
      const data = await response.json();
      setApiToken(data.apiKey);
    } catch (error) {
      console.error('Error fetching API key:', error);
      setApiToken('Error loading API key');
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-sentinel-text-primary mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Plan Management */}
          <div className="bg-sentinel-card p-6 rounded-xl border border-sentinel-border">
            <h2 className="text-xl font-bold text-sentinel-text-primary mb-4">Plan Management</h2>
            <div className="bg-sentinel-main p-4 rounded-lg border border-sentinel-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-semibold text-sentinel-text-primary">Business Plan <span className="text-xs bg-sentinel-green/20 text-sentinel-green px-2 py-0.5 rounded-full ml-2">Active</span></p>
                <p className="text-sm text-sentinel-text-secondary mt-1">Service expires on December 31, 2024</p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm bg-sentinel-border hover:bg-sentinel-border/80 text-sentinel-text-primary font-semibold py-2 px-4 rounded-lg transition-colors">Change Plan</button>
                <button className="text-sm bg-sentinel-primary hover:bg-sentinel-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors">Renew Now</button>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm font-medium text-sentinel-text-primary">Auto-renewal</p>
              <button onClick={() => setAutoRenew(!autoRenew)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoRenew ? 'bg-sentinel-primary' : 'bg-sentinel-main'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoRenew ? 'translate-x-6' : 'translate-x-1'}`}/>
              </button>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-sentinel-card p-6 rounded-xl border border-sentinel-border">
            <h2 className="text-xl font-bold text-sentinel-text-primary mb-4">Billing Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <p className="text-sentinel-text-secondary flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Next bill</p>
                <p className="text-sentinel-text-primary font-medium">December 31, 2024 for $99.00</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-sentinel-text-secondary flex items-center gap-2"><CreditCardIcon className="w-4 h-4" /> Payment method</p>
                <p className="text-sentinel-text-primary font-medium">Visa ending in 1234</p>
              </div>
            </div>
            <div className="mt-6 border-t border-sentinel-border pt-4 flex items-center justify-between">
              <button className="text-sm text-sentinel-primary hover:underline font-semibold">View Billing History</button>
              <button className="text-sm bg-sentinel-border hover:bg-sentinel-border/80 text-sentinel-text-primary font-semibold py-2 px-4 rounded-lg transition-colors">Update Payment</button>
            </div>
          </div>
        </div>

        {/* API Token Management */}
        <div className="lg:col-span-1">
          <div className="bg-sentinel-card p-6 rounded-xl border border-sentinel-border">
            <h2 className="text-xl font-bold text-sentinel-text-primary mb-1">API Token</h2>
            <p className="text-sm text-sentinel-text-secondary mb-4">Use this token to integrate AI Sentinel with your applications.</p>
            <div className="relative">
              <input 
                type={showToken ? 'text' : 'password'}
                readOnly 
                value={apiToken}
                className="w-full bg-sentinel-main border border-sentinel-border rounded-lg p-2.5 pr-20 text-sm font-mono"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                <button onClick={() => setShowToken(!showToken)} className="p-1.5 text-sentinel-text-secondary hover:text-sentinel-text-primary">
                  {showToken ? <EyeOffIcon className="w-4 h-4"/> : <EyeIcon className="w-4 h-4"/>}
                </button>
                 <button onClick={() => navigator.clipboard.writeText(apiToken)} className="p-1.5 text-sentinel-text-secondary hover:text-sentinel-text-primary">
                  <CopyIcon className="w-4 h-4"/>
                </button>
              </div>
            </div>
            {/* <button className="mt-4 w-full flex items-center justify-center gap-2 text-sm bg-sentinel-border hover:bg-sentinel-border/80 text-sentinel-text-primary font-semibold py-2 px-4 rounded-lg transition-colors">
              <RefreshIcon className="w-4 h-4" />
              Regenerate Token
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
