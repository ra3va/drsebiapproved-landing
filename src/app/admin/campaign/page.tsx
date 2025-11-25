'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Components
import StatsHeader from './components/StatsHeader';
import CampaignQueue from './components/CampaignQueue';
import LiveFeed from './components/LiveFeed';
import CampaignSettings from './components/CampaignSettings';
import CsvUpload from './components/CsvUpload';
import ManualEmailEntry from './components/ManualEmailEntry';
import BatchPreviewModal from './components/BatchPreviewModal';

export default function CampaignDashboard() {
    // --- State ---
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<string>('');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [uploadMode, setUploadMode] = useState<'csv' | 'manual'>('csv');

    // Data
    const [stats, setStats] = useState<any>(null);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [nextBatch, setNextBatch] = useState<any[]>([]);
    const [recentClicks, setRecentClicks] = useState<any[]>([]);

    // Modals & UI Toggles
    const [showUpload, setShowUpload] = useState(false);
    const [showBatchPreview, setShowBatchPreview] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Settings
    const [settings, setSettings] = useState({
        batchSize: 200,
        delaySeconds: 120,
        globalLimit: 200
    });

    // ESC key to close modals
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showUpload) setShowUpload(false);
                else if (showBatchPreview) setShowBatchPreview(false);
                else if (showSettings) setShowSettings(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showUpload, showBatchPreview, showSettings]);

    // --- Fetch Data ---
    const fetchStatus = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const params = new URLSearchParams();
            if (selectedCampaign) params.append('campaign', selectedCampaign);

            const res = await fetch(`/api/campaign/status?${params.toString()}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setStats(data);
            setCampaigns(data.campaigns || []);
            setNextBatch(data.nextBatch || []);
            setRecentClicks(data.clicks?.recent || []);
            setLastUpdated(new Date());

            // Update settings from API if available (optional, currently using local state as source of truth for UI)
            // In a real app, you might want to persist these to the backend or local storage

        } catch (error) {
            console.error('Failed to fetch status:', error);
            toast.error('Failed to load campaign data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial Load & Polling
    useEffect(() => {
        fetchStatus();

        // Poll for live feed updates every 30 seconds
        const interval = setInterval(() => {
            fetchStatus();
        }, 30000);

        return () => clearInterval(interval);
    }, [selectedCampaign]);

    // --- Handlers ---

    const handleStartBatch = () => {
        if (!nextBatch || nextBatch.length === 0) {
            toast.error('No emails in queue to send.');
            return;
        }
        setShowBatchPreview(true);
    };

    const handleConfirmSend = async () => {
        try {
            const res = await fetch('/api/campaign/send-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    batchSize: settings.batchSize,
                    delaySeconds: settings.delaySeconds,
                    campaignId: selectedCampaign || undefined
                })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to send batch');

            toast.success(`Batch started! Sending ${result.count} emails.`);
            setShowBatchPreview(false);
            fetchStatus(true); // Refresh data
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleSettingsSave = (newSettings: any) => {
        setSettings(newSettings);
        toast.success('Settings saved!');
        // Here you could also persist to localStorage or backend
    };

    const handleClearAll = async () => {
        try {
            const response = await fetch('/api/campaign/clear-all', { method: 'POST' });
            const result = await response.json();

            if (response.ok) {
                toast.success(`✅ Deleted ${result.deleted} records`);
                fetchStatus(true);
            } else {
                toast.error('Failed to clear data: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            toast.error('Failed to clear data: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const handleDeleteEmail = async (email: string) => {
        try {
            const response = await fetch(`/api/campaign/delete-email?email=${encodeURIComponent(email)}`, { method: 'DELETE' });
            const result = await response.json();

            if (response.ok) {
                toast.success(`Removed ${email} from queue`);
                fetchStatus(true);
            } else {
                toast.error('Failed to delete: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            toast.error('Failed to delete: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const handleDeleteCampaign = async (campaignName: string) => {
        try {
            const response = await fetch(`/api/campaign/delete-campaign?name=${encodeURIComponent(campaignName)}`, { method: 'DELETE' });
            const result = await response.json();

            if (response.ok) {
                toast.success(`Deleted campaign "${campaignName}"`);
                setSelectedCampaign(''); // Reset selection
                fetchStatus(true);
            } else {
                toast.error('Failed to delete campaign: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            toast.error('Failed to delete campaign: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    // --- Render ---

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-black text-white font-sans overflow-hidden flex flex-col">
            <Toaster position="top-right" theme="dark" />

            {/* Fixed Background Gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black pointer-events-none -z-10" />

            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-6 gap-6 overflow-hidden">

                {/* 1. Header & Key Stats (Fixed Height) */}
                <div className="flex-none">
                    <StatsHeader
                        campaigns={campaigns}
                        selectedCampaign={selectedCampaign}
                        onCampaignChange={setSelectedCampaign}
                        onStartBatch={handleStartBatch}
                        onRefresh={() => fetchStatus(true)}
                        onOpenSettings={() => setShowSettings(true)}
                        isRefreshing={refreshing}
                        hasQueuedEmails={nextBatch.length > 0}
                        lastUpdated={lastUpdated}
                        stats={{
                            total: stats?.campaign?.total || 0,
                            sent: stats?.status?.sent || 0,
                            progressPercent: stats?.campaign?.progressPercent || '0%',
                            clickRate: stats?.engagement?.clickThroughRate || '0.00%',
                            conversionRate: stats?.engagement?.conversionRate || '0.00%'
                        }}
                        onDeleteCampaign={handleDeleteCampaign}
                    />
                </div>
                {/* 2. Main Workspace (Fills remaining height) */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Panel: The Queue (Operator View) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4 h-full min-h-0"
                    >
                        <CampaignQueue
                            queue={nextBatch}
                            dailyLimit={stats?.dailyProgress?.dailyLimit || settings.globalLimit}
                            sentToday={stats?.dailyProgress?.sentToday || 0}
                            buckets={stats?.buckets}
                            onDeleteEmail={handleDeleteEmail}
                        />
                    </motion.div>

                    {/* Right Panel: Live Feed (Command View) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-8 h-full min-h-0 flex flex-col gap-6"
                    >
                        {/* Upload Button */}
                        <Button
                            variant="outline"
                            className="flex-none w-full border-dashed border-white/20 hover:border-green-500/50 hover:bg-green-500/5 text-gray-400 hover:text-green-400 h-12"
                            onClick={() => setShowUpload(true)}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload CSV to Queue
                        </Button>

                        {/* Live Feed takes remaining height */}
                        <div className="flex-1 min-h-0">
                            <LiveFeed feed={recentClicks} />
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* Modals */}
            <BatchPreviewModal
                isOpen={showBatchPreview}
                onClose={() => setShowBatchPreview(false)}
                onConfirm={handleConfirmSend}
                recipients={nextBatch}
                batchSize={settings.batchSize}
                delaySeconds={settings.delaySeconds}
                campaignName={selectedCampaign || 'All Campaigns'}
            />

            <CampaignSettings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                settings={settings}
                onSave={handleSettingsSave}
                onClearAll={handleClearAll}
            />

            {/* CSV Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        <div className="bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">Upload New Leads</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowUpload(false);
                                        setUploadMode('csv');
                                    }}
                                    className="text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Tab Switcher */}
                            <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
                                <button
                                    onClick={() => setUploadMode('csv')}
                                    className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${uploadMode === 'csv'
                                        ? 'bg-white/10 text-white border-b-2 border-blue-500'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    📄 CSV Upload
                                </button>
                                <button
                                    onClick={() => setUploadMode('manual')}
                                    className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${uploadMode === 'manual'
                                        ? 'bg-white/10 text-white border-b-2 border-blue-500'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    ✍️ Manual Entry
                                </button>
                            </div>

                            {/* Content */}
                            {uploadMode === 'csv' ? (
                                <CsvUpload onUploadComplete={() => {
                                    fetchStatus(true);
                                    setShowUpload(false);
                                    setUploadMode('csv');
                                }} />
                            ) : (
                                <ManualEmailEntry onUploadComplete={() => {
                                    fetchStatus(true);
                                    setShowUpload(false);
                                    setUploadMode('csv');
                                }} />
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
