'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Flame, Trash2 } from 'lucide-react';

interface QueueItem {
    email: string;
    name: string;
    stage: number;
    campaign: string;
}

interface CampaignQueueProps {
    queue: QueueItem[];
    dailyLimit: number;
    sentToday: number;
    buckets?: {
        followUps: number;
        newLeads: number;
    };
    onDeleteEmail: (email: string) => void;
}

export default function CampaignQueue({ queue, dailyLimit, sentToday, buckets, onDeleteEmail }: CampaignQueueProps) {
    const remaining = Math.max(0, dailyLimit - sentToday);
    const percentUsed = Math.min(100, (sentToday / dailyLimit) * 100);

    return (
        <Card className="h-full bg-gray-900/50 border-white/10 backdrop-blur-md flex flex-col overflow-hidden">
            <CardHeader className="border-b border-white/10 pb-4 flex-none space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        Next Up
                    </CardTitle>
                    <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
                        {queue.length} queued
                    </span>
                </div>

                {/* Priority Breakdown */}
                {buckets && (buckets.followUps > 0 || buckets.newLeads > 0) && (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded p-2">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Flame className="h-3 w-3 text-orange-400" />
                                <span className="text-[10px] text-orange-400 font-medium uppercase tracking-wide">Priority 1</span>
                            </div>
                            <div className="text-lg font-bold text-orange-300">{buckets.followUps}</div>
                            <div className="text-[9px] text-orange-500/70">Follow-Ups</div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Users className="h-3 w-3 text-blue-400" />
                                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wide">Priority 2</span>
                            </div>
                            <div className="text-lg font-bold text-blue-300">{buckets.newLeads}</div>
                            <div className="text-[9px] text-blue-500/70">New Leads</div>
                        </div>
                    </div>
                )}

                {/* Daily Limit Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Daily Limit Used</span>
                        <span className={`font-medium ${percentUsed >= 80 ? 'text-orange-400' : 'text-white'}`}>
                            {sentToday} / {dailyLimit}
                        </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${percentUsed >= 100 ? 'bg-red-500' :
                                percentUsed >= 80 ? 'bg-orange-500' :
                                    'bg-blue-500'
                                }`}
                            style={{ width: `${percentUsed}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-gray-500 text-right">
                        {remaining} sends remaining today
                    </p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
                {queue.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                        <Clock className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">Queue is empty</p>
                        <p className="text-xs mt-1">Add more leads or wait for follow-ups</p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <div className="divide-y divide-white/5">
                            {queue.map((item, index) => (
                                <div key={index} className="p-3 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="font-medium text-sm text-gray-200 truncate pr-2">
                                            {item.email}
                                        </div>
                                        <span className={`
                      text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide flex-shrink-0
                      ${item.stage === 1 ? 'bg-blue-500/20 text-blue-400' : ''}
                      ${item.stage === 2 ? 'bg-orange-500/20 text-orange-400' : ''}
                      ${item.stage === 3 ? 'bg-red-500/20 text-red-400' : ''}
                    `}>
                                            {item.stage === 1 ? 'New' : item.stage === 2 ? 'Follow-Up' : 'Final'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{item.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600">
                                                #{index + 1}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Delete ${item.email} from queue?`)) {
                                                        onDeleteEmail(item.email);
                                                    }
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400 p-1"
                                                title="Remove from queue"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
