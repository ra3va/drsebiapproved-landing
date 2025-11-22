'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Settings, RefreshCw, Flame, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface StatsHeaderProps {
    campaigns: any[];
    selectedCampaign: string;
    onCampaignChange: (id: string) => void;
    onStartBatch: () => void;
    onRefresh: () => void;
    onOpenSettings: () => void;
    stats: {
        total: number;
        sent: number;
        progressPercent: string;
        clickRate: string;
        conversionRate: string;
    };
    isRefreshing: boolean;
    hasQueuedEmails: boolean;
    lastUpdated: Date;
    onDeleteCampaign: (campaignName: string) => void;
}

export default function StatsHeader({
    campaigns,
    selectedCampaign,
    onCampaignChange,
    onStartBatch,
    onRefresh,
    onOpenSettings,
    stats,
    isRefreshing,
    hasQueuedEmails,
    lastUpdated,
    onDeleteCampaign
}: StatsHeaderProps) {
    return (
        <div className="space-y-6">
            {/* Top Bar: Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Campaign Command</h1>
                    <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                        Manage and monitor your email outreach
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedCampaign}
                        onChange={(e) => onCampaignChange(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none min-w-[200px]"
                    >
                        <option value="">All Campaigns</option>
                        {campaigns.map((c) => (
                            <option key={c.name} value={c.name}>
                                {c.name} ({c.total})
                            </option>
                        ))}
                    </select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenSettings}
                        className="border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white w-10 h-10 p-0"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className={`border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white w-10 h-10 p-0 ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (selectedCampaign) {
                                if (confirm(`⚠️ DELETE CAMPAIGN "${selectedCampaign}"?\n\nThis will delete ALL emails and history for this campaign.\n\nAre you sure?`)) {
                                    onDeleteCampaign(selectedCampaign);
                                }
                            }
                        }}
                        disabled={!selectedCampaign}
                        className={`w-10 h-10 p-0 transition-colors ${selectedCampaign
                                ? 'border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300'
                                : 'border-white/5 bg-white/5 text-gray-600 cursor-not-allowed'
                            }`}
                        title={selectedCampaign ? "Delete this campaign" : "Select a campaign to delete it"}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Stats & Primary Action */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">

                {/* Main Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-12 md:col-span-8 grid grid-cols-3 gap-4"
                >
                    {/* Sent Progress */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-1000" style={{ width: stats.progressPercent }} />
                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Sent</div>
                        <div className="text-2xl font-bold text-white">{stats.sent.toLocaleString()} <span className="text-gray-500 text-sm font-normal">/ {stats.total.toLocaleString()}</span></div>
                        <div className="text-xs text-blue-400 mt-2 font-medium">{stats.progressPercent} Complete</div>
                    </div>

                    {/* Click Rate */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md group hover:bg-white/10 transition-colors">
                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Click Rate</div>
                        <div className="text-2xl font-bold text-purple-400">{stats.clickRate}</div>
                        <div className="text-xs text-gray-500 mt-2">Unique Clicks</div>
                    </div>

                    {/* Conversions */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md group hover:bg-white/10 transition-colors">
                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Conversions</div>
                        <div className="text-2xl font-bold text-green-400">{stats.conversionRate}</div>
                        <div className="text-xs text-gray-500 mt-2">Purchases</div>
                    </div>
                </motion.div>

                {/* Primary Action Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-12 md:col-span-4"
                >
                    <Button
                        onClick={onStartBatch}
                        className={`
              w-full h-full min-h-[100px] bg-gradient-to-br from-green-600 to-green-700 
              hover:from-green-500 hover:to-green-600 text-white shadow-lg border border-green-500/20 
              rounded-xl flex flex-col items-center justify-center gap-2 group
              ${hasQueuedEmails ? 'shadow-green-900/40 animate-pulse' : 'shadow-green-900/20'}
            `}
                    >
                        <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 fill-current" />
                        </div>
                        <span className="text-lg font-bold">Start Daily Batch</span>
                        <span className="text-xs text-green-100 opacity-80">Send queued emails now</span>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
