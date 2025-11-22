'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Plus, Trash2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface ManualEmailEntryProps {
    onUploadComplete?: (stats: any) => void;
}

type CampaignType = 'winback' | 'warm' | 'cold' | 'general';

interface EmailEntry {
    email: string;
    firstName?: string;
    lastName?: string;
    valid: boolean;
    error?: string;
}

export default function ManualEmailEntry({ onUploadComplete }: ManualEmailEntryProps) {
    const [bulkText, setBulkText] = useState('');
    const [emails, setEmails] = useState<EmailEntry[]>([]);
    const [campaignName, setCampaignName] = useState('');
    const [campaignType, setCampaignType] = useState<CampaignType>('winback');
    const [campaignDescription, setCampaignDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadStats, setUploadStats] = useState<any>(null);

    // Validate email format
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Parse bulk text (one email per line, optionally with comma-separated name)
    const handleParseBulk = () => {
        const lines = bulkText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const parsed: EmailEntry[] = lines.map(line => {
            // Split by first comma to separate email from name
            const firstCommaIndex = line.indexOf(',');

            let email: string;
            let fullName = '';

            if (firstCommaIndex > -1) {
                // Format: "email, name"
                email = line.substring(0, firstCommaIndex).trim();
                fullName = line.substring(firstCommaIndex + 1).trim();
            } else {
                // Format: just "email"
                email = line.trim();
            }

            const nameParts = fullName.split(' ').filter(Boolean);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            return {
                email,
                firstName,
                lastName,
                valid: isValidEmail(email),
                error: isValidEmail(email) ? undefined : 'Invalid email format'
            };
        });

        setEmails(parsed);
        setBulkText('');
    };

    // Add single email
    const handleAddEmail = (email: string, firstName?: string, lastName?: string) => {
        const entry: EmailEntry = {
            email,
            firstName,
            lastName,
            valid: isValidEmail(email),
            error: isValidEmail(email) ? undefined : 'Invalid email format'
        };
        setEmails([...emails, entry]);
    };

    // Remove email
    const handleRemoveEmail = (index: number) => {
        setEmails(emails.filter((_, i) => i !== index));
    };

    // Upload to server
    const handleUpload = async () => {
        const validEmails = emails.filter(e => e.valid);
        if (validEmails.length === 0) {
            alert('No valid emails to upload');
            return;
        }

        if (!campaignName.trim()) {
            alert('Please enter a campaign name');
            return;
        }

        setUploading(true);

        try {
            // Convert to CSV format: email,name
            const csvData = validEmails.map(e =>
                `${e.email},${[e.firstName, e.lastName].filter(Boolean).join(' ') || e.email.split('@')[0]}`
            ).join('\n');

            const response = await fetch('/api/campaign/upload-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    csvData,
                    campaignId: 'manual',
                    batchSize: 75,
                    campaignName: campaignName.trim(),
                    campaignType,
                    campaignDescription: campaignDescription.trim() || null,
                    sourceFiles: ['Manual Entry']
                })
            });

            const result = await response.json();

            if (response.ok) {
                setUploadStats(result.stats);
                if (onUploadComplete) {
                    onUploadComplete(result.stats);
                }
            } else {
                alert(`Upload failed: ${result.message || result.error}`);
            }
        } catch (error) {
            alert('Failed to upload emails: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const validCount = emails.filter(e => e.valid).length;
    const invalidCount = emails.filter(e => !e.valid).length;

    return (
        <Card className="w-full bg-white/5 border-white/10 backdrop-blur-md text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Mail className="h-5 w-5" />
                    Manual Email Entry
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Upload Success */}
                {uploadStats && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-green-300">Upload Successful!</h3>
                                <p className="text-sm text-green-400/80 mt-1">
                                    {uploadStats.uploaded} emails added to <strong>{uploadStats.campaignName || campaignName}</strong>
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setUploadStats(null);
                                        setEmails([]);
                                        setCampaignName('');
                                        setCampaignDescription('');
                                    }}
                                    className="mt-3 border-green-500/30 text-green-400 hover:bg-green-500/10"
                                >
                                    Add More Emails
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {!uploadStats && (
                    <>
                        {/* Bulk Paste */}
                        <div className="space-y-2">
                            <Label className="text-gray-300">Paste Emails (one per line or comma-separated)</Label>
                            <textarea
                                value={bulkText}
                                onChange={(e) => setBulkText(e.target.value)}
                                placeholder="john@example.com&#10;jane@example.com, Jane Doe&#10;mike@example.com"
                                rows={5}
                                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                            />
                            <Button
                                onClick={handleParseBulk}
                                disabled={!bulkText.trim()}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Parse & Add to List
                            </Button>
                        </div>

                        {/* Email List */}
                        {emails.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-300">Email List ({emails.length})</Label>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEmails([])}
                                        className="border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs"
                                    >
                                        Clear All
                                    </Button>
                                </div>

                                <div className="max-h-64 overflow-y-auto border border-white/10 rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-black/50 sticky top-0">
                                            <tr>
                                                <th className="px-3 py-2 text-left text-gray-400 font-medium">#</th>
                                                <th className="px-3 py-2 text-left text-gray-400 font-medium">Email</th>
                                                <th className="px-3 py-2 text-left text-gray-400 font-medium">Name</th>
                                                <th className="px-3 py-2 text-left text-gray-400 font-medium">Status</th>
                                                <th className="px-3 py-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {emails.map((entry, index) => (
                                                <tr key={index} className={entry.valid ? 'hover:bg-white/5' : 'bg-red-900/10'}>
                                                    <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                                                    <td className="px-3 py-2 font-mono text-xs text-gray-300">{entry.email}</td>
                                                    <td className="px-3 py-2 text-gray-300">{[entry.firstName, entry.lastName].filter(Boolean).join(' ') || '-'}</td>
                                                    <td className="px-3 py-2">
                                                        {entry.valid ? (
                                                            <span className="text-green-400 text-xs flex items-center gap-1">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Valid
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-400 text-xs flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {entry.error}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleRemoveEmail(index)}
                                                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-3">
                                    <div className="flex-1 bg-green-900/10 border border-green-500/20 rounded p-2 text-center">
                                        <div className="text-xl font-bold text-green-400">{validCount}</div>
                                        <div className="text-xs text-green-500/70">Valid</div>
                                    </div>
                                    {invalidCount > 0 && (
                                        <div className="flex-1 bg-red-900/10 border border-red-500/20 rounded p-2 text-center">
                                            <div className="text-xl font-bold text-red-400">{invalidCount}</div>
                                            <div className="text-xs text-red-500/70">Invalid</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Campaign Details */}
                        {emails.length > 0 && (
                            <div className="border border-white/10 rounded-lg p-4 bg-white/5 space-y-3">
                                <h4 className="text-sm font-semibold text-gray-200">Campaign Details</h4>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                        <div>
                                            <Label className="text-xs text-gray-400">Campaign Name *</Label>
                                            <Input
                                                value={campaignName}
                                                onChange={(e) => setCampaignName(e.target.value)}
                                                placeholder="e.g., VIP Manual Add"
                                                className="mt-1 bg-black/50 border-white/10 text-white focus:ring-green-500"
                                            />
                                            <p className="text-[10px] text-yellow-500/80 mt-1">
                                                💡 This creates a NEW campaign with this name (separate from the dropdown selection)
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-400">Campaign Type</Label>
                                        <select
                                            value={campaignType}
                                            onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                                            className="mt-1 w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
                                        >
                                            <option value="winback">🔥 Win-Back (Former Buyers)</option>
                                            <option value="warm">☀️ Warm Leads</option>
                                            <option value="cold">❄️ Cold/Prospects</option>
                                            <option value="general">📧 General / Mixed</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-400">Notes (optional)</Label>
                                    <textarea
                                        value={campaignDescription}
                                        onChange={(e) => setCampaignDescription(e.target.value)}
                                        rows={2}
                                        placeholder="Add context for this batch"
                                        className="mt-1 w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        {emails.length > 0 && validCount > 0 && (
                            <Button
                                onClick={handleUpload}
                                disabled={uploading || !campaignName.trim()}
                                className="w-full bg-green-600 hover:bg-green-500 text-white"
                                size="lg"
                            >
                                {uploading ? 'Uploading...' : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload {validCount} Email{validCount !== 1 ? 's' : ''} to Campaign
                                    </>
                                )}
                            </Button>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
