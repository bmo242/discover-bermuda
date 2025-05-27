'use client';

import ProtectedWrapper from "@/components/auth/ProtectedWrapper";
import { useState } from "react";
import Link from "next/link";
import UsersTab from "./components/UsersTab";
import StatsOverview from "./components/StatsOverview";
import LocationsTab from "./components/LocationsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'locations', label: 'Locations' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <ProtectedWrapper allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-primary text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Back to Site
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeTab === 'overview' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <StatsOverview />
              </div>
            </div>
          )}

          {activeTab === 'users' && <UsersTab />}
          
          {activeTab === 'locations' && <LocationsTab />}

          {activeTab === 'settings' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                <p className="mt-2 text-gray-500">This section is under development.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedWrapper>
  );
} 