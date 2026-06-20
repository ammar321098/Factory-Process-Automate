'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Mail, Phone, User, Settings, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const profileUser = user || {
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'Viewer',
    phone: '+000 000 0000',
    joined: '2025-01-01',
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all"
          >
            ← Back
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl shadow-lg p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
              <User className="h-14 w-14 text-white" />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-success-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {profileUser.name}
              </h2>
              <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                <Shield className="h-3 w-3 mr-1" />
                {profileUser.role?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="h-5 w-5 text-primary-500" />
                <span>{profileUser.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Phone className="h-5 w-5 text-primary-500" />
                <span>{profileUser.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Calendar className="h-5 w-5 text-primary-500" />
                <span>Joined: {profileUser.joined}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Settings className="h-5 w-5 text-primary-500" />
                <span>Account Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Section */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Recent Activity
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>✅ Logged in from web - 2 hours ago</li>
              <li>📦 Viewed Orders page - 1 day ago</li>
              <li>💬 Updated Profile Info - 3 days ago</li>
            </ul>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Account Insights
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>💰 Total Orders: <span className="font-medium text-gray-800 dark:text-gray-200">24</span></p>
              <p>📈 Average Rating: <span className="font-medium text-gray-800 dark:text-gray-200">4.7 ★</span></p>
              <p>🕒 Last Active: <span className="font-medium text-gray-800 dark:text-gray-200">Today, 10:45 AM</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
