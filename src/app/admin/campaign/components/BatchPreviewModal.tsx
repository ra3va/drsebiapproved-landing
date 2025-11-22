'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Send, Clock, Users, Mail, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BatchRecipient {
  email: string;
  name: string;
  stage: number;
}

interface BatchPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipients: BatchRecipient[];
  batchSize: number;
  delaySeconds: number;
  campaignName: string;
}

export default function BatchPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  recipients,
  batchSize,
  delaySeconds,
  campaignName
}: BatchPreviewProps) {
  if (!isOpen) return null;

  // Calculate stage breakdown
  const stageBreakdown = recipients.reduce((acc, r) => {
    acc[r.stage] = (acc[r.stage] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const followUps = recipients.filter(r => r.stage > 1).length;
  const newLeads = recipients.filter(r => r.stage === 1).length;

  // Calculate estimated send time
  const totalMinutes = Math.floor((recipients.length * delaySeconds) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const estimatedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const getStageLabel = (stage: number): string => {
    switch (stage) {
      case 1: return 'Win-Back (20% Off)';
      case 2: return 'Gentle Reminder';
      case 3: return 'Last Chance (Urgency)';
      default: return `Stage ${stage}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl"
          >
            <Card className="w-full max-h-[90vh] overflow-hidden flex flex-col bg-gray-900 border-white/10 text-white shadow-2xl">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Batch Send Confirmation</CardTitle>
                  <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Campaign Info */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-300 mb-1">Campaign: {campaignName}</h3>
                  <p className="text-sm text-blue-400/80">Ready to send batch</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                    <Users className="h-5 w-5 text-gray-400 mb-2" />
                    <div className="text-2xl font-bold text-white">{recipients.length}</div>
                    <div className="text-xs text-gray-500">Total Recipients</div>
                  </div>

                  <div className="bg-orange-900/10 rounded-lg p-4 border border-orange-500/10">
                    <Mail className="h-5 w-5 text-orange-500 mb-2" />
                    <div className="text-2xl font-bold text-orange-400">{followUps}</div>
                    <div className="text-xs text-orange-500/70">Follow-Ups</div>
                  </div>

                  <div className="bg-blue-900/10 rounded-lg p-4 border border-blue-500/10">
                    <Users className="h-5 w-5 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold text-blue-400">{newLeads}</div>
                    <div className="text-xs text-blue-500/70">New Leads</div>
                  </div>

                  <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-500/10">
                    <Clock className="h-5 w-5 text-purple-500 mb-2" />
                    <div className="text-2xl font-bold text-purple-400">{estimatedTime}</div>
                    <div className="text-xs text-purple-500/70">Est. Duration</div>
                  </div>
                </div>

                {/* Stage Breakdown */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-300">Email Templates Being Sent</h3>
                  <div className="space-y-2">
                    {Object.entries(stageBreakdown).map(([stage, count]) => (
                      <div key={stage} className="flex items-center justify-between bg-white/5 rounded p-3 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${stage === '1' ? 'bg-green-500/20 text-green-400' : ''}
                            ${stage === '2' ? 'bg-blue-500/20 text-blue-400' : ''}
                            ${stage === '3' ? 'bg-red-500/20 text-red-400' : ''}
                          `}>
                            {stage}
                          </div>
                          <div>
                            <div className="font-medium text-gray-200">{getStageLabel(parseInt(stage))}</div>
                            <div className="text-xs text-gray-500">Stage {stage} email</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-white">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Send Configuration */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <h3 className="font-semibold mb-3 text-sm text-gray-300">Send Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Batch Size Limit:</span>
                      <span className="font-medium text-gray-300">{batchSize} emails/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delay Between Sends:</span>
                      <span className="font-medium text-gray-300">{delaySeconds}s ({Math.floor(delaySeconds / 60)}m)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Completion:</span>
                      <span className="font-medium text-gray-300">{estimatedTime} from now</span>
                    </div>
                  </div>
                </div>

                {/* Rate Limit Warning */}
                {recipients.length > 250 && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-400 text-sm">Rate Limit Warning</h4>
                      <p className="text-xs text-yellow-500/80 mt-1">
                        This batch exceeds recommended limits. Zoho free tier allows 300 emails/day max.
                        Consider reducing batch size to 150-250 to avoid throttling.
                      </p>
                    </div>
                  </div>
                )}

                {/* Recipient Preview */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-300">Recipients Preview</h3>
                  <div className="border border-white/10 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-400 font-medium">#</th>
                          <th className="px-4 py-2 text-left text-gray-400 font-medium">Email</th>
                          <th className="px-4 py-2 text-left text-gray-400 font-medium">Name</th>
                          <th className="px-4 py-2 text-left text-gray-400 font-medium">Stage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {recipients.slice(0, 10).map((recipient, index) => (
                          <tr key={index} className="hover:bg-white/5">
                            <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                            <td className="px-4 py-2 font-mono text-xs text-gray-300">{recipient.email}</td>
                            <td className="px-4 py-2 text-gray-300">{recipient.name}</td>
                            <td className="px-4 py-2">
                              <span className={`
                                px-2 py-1 rounded text-xs font-medium
                                ${recipient.stage === 1 ? 'bg-green-500/20 text-green-400' : ''}
                                ${recipient.stage === 2 ? 'bg-blue-500/20 text-blue-400' : ''}
                                ${recipient.stage === 3 ? 'bg-red-500/20 text-red-400' : ''}
                              `}>
                                Stage {recipient.stage}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {recipients.length > 10 && (
                      <div className="bg-white/5 border-t border-white/10 px-4 py-2 text-xs text-gray-500 text-center">
                        + {recipients.length - 10} more recipients
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Warning */}
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-400 text-sm">Confirm Before Sending</h4>
                    <p className="text-xs text-red-500/80 mt-1">
                      This will send {recipients.length} emails immediately. All links will be tracked.
                      This action cannot be undone. Make sure you've reviewed the recipient list.
                    </p>
                  </div>
                </div>

              </CardContent>

              {/* Action Buttons */}
              <div className="border-t border-white/10 p-4 flex gap-3 bg-white/5">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Confirm & Send {recipients.length} Emails
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
