'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, AlertCircle, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CsvRow {
  rawData: string[];
  email?: string;
  firstName?: string;
  lastName?: string;
  valid: boolean;
  error?: string;
}

interface CsvUploadProps {
  campaignId?: string;
  onUploadComplete?: (stats: any) => void;
}

type CampaignType = 'winback' | 'warm' | 'cold' | 'general';

export default function CsvUpload({ campaignId, onUploadComplete }: CsvUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<{
    email: number;
    firstName: number;
    lastName: number;
  }>({ email: -1, firstName: -1, lastName: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<any>(null);
  const [showMapping, setShowMapping] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState<CampaignType>('winback');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [headerWarning, setHeaderWarning] = useState<string | null>(null);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Parse CSV file (handles multi-column CSVs)
  const parseCSV = (content: string): { headers: string[], rows: CsvRow[] } => {
    const lines = content.trim().split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    // First line is headers
    const headerLine = lines[0];
    const parsedHeaders = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));

    // Parse data rows
    const rows: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const columns = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

      rows.push({
        rawData: columns,
        valid: true, // Will validate after mapping
      });
    }

    return { headers: parsedHeaders, rows };
  };

  // Auto-detect column mapping
  const autoDetectColumns = (headers: string[]): { email: number; firstName: number; lastName: number } => {
    const emailIndex = headers.findIndex(h =>
      /email|e-mail|mail/i.test(h)
    );
    const firstNameIndex = headers.findIndex(h =>
      /first.*name|fname|firstname/i.test(h)
    );
    const lastNameIndex = headers.findIndex(h =>
      /last.*name|lname|lastname|surname/i.test(h)
    );

    return {
      email: emailIndex,
      firstName: firstNameIndex,
      lastName: lastNameIndex
    };
  };

  // Apply column mapping to rows
  const applyMapping = (rows: CsvRow[], mapping: typeof columnMapping): CsvRow[] => {
    return rows.map(row => {
      const email = mapping.email >= 0 ? row.rawData[mapping.email] : '';
      const firstName = mapping.firstName >= 0 ? row.rawData[mapping.firstName] : '';
      const lastName = mapping.lastName >= 0 ? row.rawData[mapping.lastName] : '';

      const valid = isValidEmail(email);

      return {
        ...row,
        email,
        firstName,
        lastName,
        valid,
        error: valid ? undefined : 'Invalid email format'
      };
    });
  };

  const generateCampaignName = (selectedFiles: File[]): string => {
    if (selectedFiles.length === 0) return 'New Campaign';
    if (selectedFiles.length === 1) {
      const raw = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
      const cleaned = raw.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
      return cleaned ? cleaned : 'New Campaign';
    }
    const timestamp = new Date().toLocaleDateString();
    return `Combined Upload (${selectedFiles.length} files) - ${timestamp}`;
  };

  const handleFilesSelect = (selectedFiles: File[]) => {
    const csvFiles = selectedFiles.filter(
      (file) => file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')
    );

    if (csvFiles.length === 0) {
      alert('Please upload at least one CSV file');
      return;
    }

    setFiles(csvFiles);
    setUploadStats(null);
    setShowMapping(false);
    setHeaderWarning(null);
    setCampaignDescription('');

    Promise.all(csvFiles.map((file) => file.text()))
      .then((contents) => {
        const parsedData = contents.map((content) => parseCSV(content));

        if (parsedData.length === 0) {
          setHeaders([]);
          setPreview([]);
          return;
        }

        const baseHeaders = parsedData[0].headers;
        setHeaders(baseHeaders);

        const detectedMapping = autoDetectColumns(baseHeaders);
        setColumnMapping(detectedMapping);

        const combinedRows = parsedData.flatMap(({ rows }) => rows);
        const mappedRows = applyMapping(combinedRows, detectedMapping);
        setPreview(mappedRows);

        if (detectedMapping.email === -1) {
          setShowMapping(true);
        }

        const hasMismatch = parsedData.some(({ headers: fileHeaders }) => {
          if (fileHeaders.length !== baseHeaders.length) return true;
          return fileHeaders.some((header, index) => header !== baseHeaders[index]);
        });
        setHeaderWarning(hasMismatch ? 'Some files have different column headers. Double-check the column mapping before uploading.' : null);

        setCampaignName(generateCampaignName(csvFiles));
      })
      .catch((error) => {
        console.error('[CsvUpload] Failed to read CSV files:', error);
        alert('Failed to read CSV files. Please try again.');
        setFiles([]);
        setPreview([]);
        setHeaders([]);
      });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesSelect(droppedFiles);
  };

  // File input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
      handleFilesSelect(selectedFiles);
    }
  };

  // Update column mapping
  const handleMappingChange = (field: 'email' | 'firstName' | 'lastName', columnIndex: number) => {
    const newMapping = { ...columnMapping, [field]: columnIndex };
    setColumnMapping(newMapping);

    // Re-apply mapping
    const mappedRows = applyMapping(preview, newMapping);
    setPreview(mappedRows);
  };

  // Upload to server (DOES NOT SEND - just uploads to database)
  const handleUpload = async () => {
    if (files.length === 0 || preview.length === 0) return;

    const validRows = preview.filter(row => row.valid);
    if (validRows.length === 0) {
      alert('No valid emails to upload');
      return;
    }

    const trimmedCampaignName = campaignName.trim();
    if (!trimmedCampaignName) {
      alert('Please enter a campaign name before uploading');
      return;
    }

    const trimmedDescription = campaignDescription.trim();

    console.log('[CsvUpload] Starting upload...', { validCount: validRows.length });
    setUploading(true);

    try {
      // Convert to simple CSV format: email,name
      const csvData = validRows.map(row =>
        `${row.email},${[row.firstName, row.lastName].filter(Boolean).join(' ') || row.email?.split('@')[0]}`
      ).join('\n');

      console.log('[CsvUpload] Sending request to /api/campaign/upload-list...');

      const response = await fetch('/api/campaign/upload-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvData,
          campaignId: campaignId || 'default',
          batchSize: 75,
          campaignName: trimmedCampaignName,
          campaignType,
          campaignDescription: trimmedDescription || null,
          sourceFiles: files.map((f) => f.name)
        })
      });

      console.log('[CsvUpload] Response status:', response.status);

      const result = await response.json();
      console.log('[CsvUpload] Response data:', result);

      if (response.ok) {
        console.log('[CsvUpload] Upload successful!', result.stats);
        setUploadStats(result.stats);

        // Call completion callback
        if (onUploadComplete) {
          console.log('[CsvUpload] Calling onUploadComplete callback...');
          onUploadComplete(result.stats);
        } else {
          console.warn('[CsvUpload] No onUploadComplete callback provided!');
        }
      } else {
        console.error('[CsvUpload] Upload failed:', result);
        alert(`Upload failed: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('[CsvUpload] Upload error:', error);
      alert('Failed to upload CSV: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
      console.log('[CsvUpload] Upload process complete');
    }
  };

  // Clear selection
  const handleClear = () => {
    setFiles([]);
    setPreview([]);
    setHeaders([]);
    setColumnMapping({ email: -1, firstName: -1, lastName: -1 });
    setUploadStats(null);
    setShowMapping(false);
    setCampaignName('');
    setCampaignDescription('');
    setHeaderWarning(null);
  };

  const validCount = preview.filter(row => row.valid).length;
  const invalidCount = preview.filter(row => !row.valid).length;

  return (
    <Card className="w-full bg-white/5 border-white/10 backdrop-blur-md text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Upload Customer List</span>
          {files.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-gray-400 hover:text-white hover:bg-white/10">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Upload Stats (After Upload) */}
        {uploadStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-900/20 border border-green-500/30 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-300">Upload Successful!</h3>
                <p className="text-sm text-green-400/80 mt-1">
                  {uploadStats.uploaded} customers added to <strong>{uploadStats.campaignName || campaignName}</strong> (NOT sent yet)
                </p>
                <div className="mt-2 text-xs text-green-500/70 space-y-1">
                  <div>Total Batches: {uploadStats.totalBatches}</div>
                  <div>Batch Size: {uploadStats.batchSize} emails/day</div>
                  <div>Estimated Duration: {uploadStats.estimatedDays} days</div>
                </div>
                <div className="mt-3 bg-yellow-900/20 border border-yellow-500/30 rounded p-2">
                  <p className="text-xs text-yellow-400 font-semibold">
                    ⚠️ Emails are queued but NOT sent. Use the "Start Daily Batch" button on the dashboard to send.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Drag-Drop Zone */}
        {files.length === 0 && (
          <div
            className={`
              border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200
              ${isDragging ? 'border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'border-white/20 bg-white/5 hover:border-green-500/50 hover:bg-white/10'}
              cursor-pointer group
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-10 w-10 text-gray-400 group-hover:text-green-400 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Drop CSV file(s) here</h3>
            <p className="text-sm text-gray-400 mb-6">
              or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Supports multi-column CSVs (drop multiple files to merge into one campaign)
            </p>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Column Mapping (if needed) */}
        {files.length > 0 && showMapping && headers.length > 0 && (
          <Card className="border-yellow-500/30 bg-yellow-900/10">
            <CardHeader>
              <CardTitle className="text-sm text-yellow-400">Map Your Columns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-yellow-400/80">
                Select which columns contain email, first name, and last name:
              </p>

              {/* Email Column */}
              <div>
                <label className="text-xs font-medium block mb-1 text-gray-400">Email Column *</label>
                <select
                  value={columnMapping.email}
                  onChange={(e) => handleMappingChange('email', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                >
                  <option value="-1">-- Select Column --</option>
                  {headers.map((header, index) => (
                    <option key={index} value={index}>{header}</option>
                  ))}
                </select>
              </div>

              {/* First Name Column */}
              <div>
                <label className="text-xs font-medium block mb-1 text-gray-400">First Name Column (optional)</label>
                <select
                  value={columnMapping.firstName}
                  onChange={(e) => handleMappingChange('firstName', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                >
                  <option value="-1">-- Select Column --</option>
                  {headers.map((header, index) => (
                    <option key={index} value={index}>{header}</option>
                  ))}
                </select>
              </div>

              {/* Last Name Column */}
              <div>
                <label className="text-xs font-medium block mb-1 text-gray-400">Last Name Column (optional)</label>
                <select
                  value={columnMapping.lastName}
                  onChange={(e) => handleMappingChange('lastName', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                >
                  <option value="-1">-- Select Column --</option>
                  {headers.map((header, index) => (
                    <option key={index} value={index}>{header}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => setShowMapping(false)}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white"
                size="sm"
              >
                Apply Mapping
              </Button>
            </CardContent>
          </Card>
        )}

        {/* File Preview */}
        {files.length > 0 && preview.length > 0 && !uploadStats && (
          <div className="space-y-4">

            {/* Selected Files */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-300">Selected Files</span>
                <span className="text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((selectedFile, index) => (
                  <span
                    key={`${selectedFile.name}-${index}`}
                    className="text-xs px-2 py-1 bg-white/10 border border-white/10 rounded-full text-gray-300"
                  >
                    {selectedFile.name}
                  </span>
                ))}
              </div>
              {headerWarning && (
                <div className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-500/30 rounded p-2">
                  {headerWarning}
                </div>
              )}
            </div>

            {/* Campaign Details */}
            <div className="border border-white/10 rounded-lg p-4 bg-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-200">Campaign Details</h4>
                <span className="text-xs text-gray-500">Required</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g., Win-Back Feb 2025"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">
                    Campaign Type
                  </label>
                  <select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="winback">🔥 Win-Back (Former Buyers)</option>
                    <option value="warm">☀️ Warm Leads</option>
                    <option value="cold">❄️ Cold/Prospects</option>
                    <option value="general">📧 General / Mixed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  rows={2}
                  placeholder="Add context so you can recognize this upload later"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded text-sm text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <p className="text-xs text-gray-500">
                Every CSV upload is tagged with this campaign name so you can switch between lists on the dashboard later.
              </p>
            </div>

            {/* Column Mapping Toggle */}
            {headers.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMapping(!showMapping)}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
              >
                {showMapping ? 'Hide' : 'Adjust'} Column Mapping
              </Button>
            )}

            {/* Stats */}
            <div className="flex gap-4">
              <div className="flex-1 bg-green-900/10 border border-green-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-green-400">{validCount}</div>
                    <div className="text-xs text-green-500/70">Valid Emails</div>
                  </div>
                </div>
              </div>

              {invalidCount > 0 && (
                <div className="flex-1 bg-red-900/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-2xl font-bold text-red-400">{invalidCount}</div>
                      <div className="text-xs text-red-500/70">Invalid/Skipped</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{preview.length}</div>
                    <div className="text-xs text-gray-500">Total Rows</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Table */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <div className="bg-white/5 border-b border-white/10 px-4 py-2">
                <h4 className="font-semibold text-sm text-gray-300">Preview (first 10 rows)</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-400 font-medium">#</th>
                      <th className="px-4 py-2 text-left text-gray-400 font-medium">Email</th>
                      <th className="px-4 py-2 text-left text-gray-400 font-medium">Name</th>
                      <th className="px-4 py-2 text-left text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {preview.slice(0, 10).map((row, index) => (
                      <tr key={index} className={row.valid ? 'hover:bg-white/5' : 'bg-red-900/10 hover:bg-red-900/20'}>
                        <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                        <td className="px-4 py-2 font-mono text-xs text-gray-300">{row.email || '-'}</td>
                        <td className="px-4 py-2 text-gray-300">{[row.firstName, row.lastName].filter(Boolean).join(' ') || '-'}</td>
                        <td className="px-4 py-2">
                          {row.valid ? (
                            <span className="text-green-400 text-xs flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Valid
                            </span>
                          ) : (
                            <span className="text-red-400 text-xs flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {row.error}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.length > 10 && (
                <div className="bg-white/5 border-t border-white/10 px-4 py-2 text-xs text-gray-500">
                  + {preview.length - 10} more rows
                </div>
              )}
            </div>

            {/* Upload Button (NOT SEND!) */}
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-300 text-sm">This ONLY Uploads</h4>
                  <p className="text-xs text-blue-400/80 mt-1">
                    Clicking below will add {validCount} emails to your campaign database.
                    <strong> NO EMAILS WILL BE SENT.</strong> You must use the "Start Daily Batch" button on the dashboard to send.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading || validCount === 0 || columnMapping.email === -1 || !campaignName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                size="lg"
              >
                {uploading ? 'Uploading...' : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Upload {validCount} Email{validCount !== 1 ? 's' : ''} to Campaign (No Sending)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
