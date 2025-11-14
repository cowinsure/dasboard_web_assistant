import React from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import type { NavLink } from '../types';
import {
  DashboardIcon, AnalyticsIcon, ChatsIcon, SettingsIcon, IntegrationsIcon,
  HelpCenterIcon, LogoutIcon, NewBotIcon, LogoIcon
} from './icons/Icons';


const mainNavLinks: NavLink[] = [
  { path: '/dashboard', name: 'Dashboard', icon: DashboardIcon },
  { path: '/analytics', name: 'Analytics', icon: AnalyticsIcon },
  { path: '/chats', name: 'Chats', icon: ChatsIcon },
  { path: '/settings', name: 'Settings', icon: SettingsIcon },
  { path: '/data-onboarding', name: 'Data Onboarding', icon: IntegrationsIcon },
];

const helpNavLinks: NavLink[] = [
    { path: '/help', name: 'Help Center', icon: HelpCenterIcon },
    { path: '/logout', name: 'Log Out', icon: LogoutIcon },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-sentinel-main flex flex-col p-4 border-r border-sentinel-border">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="bg-sentinel-card p-2 rounded-lg">
          <LogoIcon className="w-6 h-6 text-sentinel-text-primary"/>
        </div>
        <div>
          <h1 className="text-md font-bold text-sentinel-text-primary">AI Sentinel</h1>
          <p className="text-xs text-sentinel-text-secondary">Business Bots</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col justify-between">
        <div>
            <ul className="space-y-2">
            {mainNavLinks.map((link) => (
                <li key={link.name}>
                <RouterNavLink
                    to={link.path}
                    className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                        ? 'bg-sentinel-primary text-white'
                        : 'text-sentinel-text-secondary hover:bg-sentinel-card hover:text-sentinel-text-primary'
                    }`
                    }
                >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                </RouterNavLink>
                </li>
            ))}
            </ul>
        </div>
        
        <div>
            <button className="w-full flex items-center justify-center gap-2 bg-sentinel-primary text-white font-semibold py-2.5 rounded-lg mb-4 hover:bg-sentinel-primary-hover transition-colors">
                <NewBotIcon className="w-5 h-5"/>
                <span>New Bot</span>
            </button>
            <ul className="space-y-2">
            {helpNavLinks.map((link) => (
                <li key={link.name}>
                {link.path === '/logout' ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem('accessToken');
                      navigate('/login');
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sentinel-text-secondary hover:bg-sentinel-card hover:text-sentinel-text-primary transition-colors w-full text-left"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </button>
                ) : (
                  <RouterNavLink
                    to={link.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sentinel-text-secondary hover:bg-sentinel-card hover:text-sentinel-text-primary transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </RouterNavLink>
                )}
                </li>
            ))}
            </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;