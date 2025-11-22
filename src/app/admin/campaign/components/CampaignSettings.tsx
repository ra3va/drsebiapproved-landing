'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';

interface CampaignSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    settings: {
        batchSize: number;
        delaySeconds: number;
        globalLimit: number;
    };
    onSave: (newSettings: any) => void;
    onClearAll: () => void;
}

export default function CampaignSettings({ isOpen, onClose, settings, onSave, onClearAll }: CampaignSettingsProps) {
    const [localSettings, setLocalSettings] = useState(settings);

    // Update local state when prop changes
    React.useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = () => {
        onSave(localSettings);
        onClose();
    };

    const handleClearAll = () => {
        if (confirm('⚠️ DELETE ALL CAMPAIGN DATA?\n\nThis will permanently delete:\n- All email records\n- All click tracking data\n- All campaign history\n\nThis cannot be undone. Are you sure?')) {
            onClearAll();
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-gray-400" />
                        Campaign Settings
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Configure global limits and sending behavior.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="batchSize" className="text-gray-300">Batch Size (emails per send)</Label>
                        <Input
                            id="batchSize"
                            type="number"
                            value={localSettings.batchSize}
                            onChange={(e) => setLocalSettings({ ...localSettings, batchSize: parseInt(e.target.value) })}
                            min="1"
                            max="300"
                            className="bg-black/50 border-white/10 text-white focus:ring-green-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="delaySeconds" className="text-gray-300">Delay Between Emails (seconds)</Label>
                        <Input
                            id="delaySeconds"
                            type="number"
                            value={localSettings.delaySeconds}
                            onChange={(e) => setLocalSettings({ ...localSettings, delaySeconds: parseInt(e.target.value) })}
                            min="1"
                            max="600"
                            className="bg-black/50 border-white/10 text-white focus:ring-green-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="globalLimit" className="text-gray-300">Global Daily Limit</Label>
                        <Input
                            id="globalLimit"
                            type="number"
                            value={localSettings.globalLimit}
                            className="bg-black/50 border-white/10 text-white focus:ring-green-500"
                        />
                        <p className="text-[10px] text-gray-500">
                            Hard stop limit for the entire day across all batches.
                        </p>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-6 mt-6 border-t border-red-900/30">
                        <h4 className="text-sm font-semibold text-red-400 mb-3">⚠️ Danger Zone</h4>
                        <Button
                            onClick={handleClearAll}
                            variant="outline"
                            className="w-full border-red-500/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-500/50"
                        >
                            🗑️ Clear All Campaign Data
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">This will permanently delete all emails, clicks, and campaign history.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
