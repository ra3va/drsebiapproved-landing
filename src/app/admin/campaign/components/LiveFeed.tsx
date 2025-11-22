'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, MousePointer2, ShoppingBag, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface FeedItem {
    customerEmail: string;
    clickedUrl?: string;
    fromEmailStage: number;
    campaignName: string;
    clickedAt: string;
    type?: 'click' | 'conversion' | 'sent'; // Extended for future use
}

interface LiveFeedProps {
    feed: FeedItem[];
}

export default function LiveFeed({ feed }: LiveFeedProps) {
    return (
        <Card className="h-full bg-gray-900/50 border-white/10 backdrop-blur-md flex flex-col overflow-hidden">
            <CardHeader className="border-b border-white/10 pb-4 flex-none">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-400" />
                        Live Activity
                        <span className="relative flex h-2 w-2 ml-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
                {feed.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                        <Activity className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                        <p className="text-xs mt-1">Sends and clicks will appear here</p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto custom-scrollbar p-4 space-y-4">
                        <AnimatePresence initial={false}>
                            {feed.map((item, index) => (
                                <motion.div
                                    key={`${item.customerEmail}-${item.clickedAt}-${index}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="relative pl-6 border-l-2 border-white/10 pb-1 last:pb-0"
                                >
                                    {/* Timeline Dot */}
                                    <div className={`
                    absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-gray-900
                    ${item.clickedUrl ? 'bg-purple-500' : 'bg-green-500'}
                  `} />

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-gray-400">
                                                {formatDistanceToNow(new Date(item.clickedAt), { addSuffix: true })}
                                            </span>
                                            <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">
                                                Stage {item.fromEmailStage}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-200 font-medium">
                                            {item.customerEmail}
                                        </div>

                                        <div className="text-xs text-gray-400 flex items-center gap-1.5">
                                            {item.clickedUrl ? (
                                                <>
                                                    <MousePointer2 className="h-3 w-3 text-purple-400" />
                                                    Clicked <span className="text-purple-300 truncate max-w-[200px]">{item.clickedUrl}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="h-3 w-3 text-green-400" />
                                                    Purchased
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
