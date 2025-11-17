'use client';

import { useEffect, useState } from 'react';

interface SyncLog {
  id: string;
  service: 'square' | 'brevo';
  operation: string;
  status: 'success' | 'error';
  details: any;
  created_at: string;
}

export default function IntegrationsPage() {
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    fetchSyncLogs();
  }, []);

  async function fetchSyncLogs() {
    setLoading(true);

    try {
      const response = await fetch('/api/admin/sync-logs');
      if (response.ok) {
        const data = await response.json();
        setSyncLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch sync logs:', error);
    }

    setLoading(false);
  }

  const handleManualSync = async (type: 'square' | 'brevo') => {
    if (!confirm(`Manually trigger ${type} sync?`)) {
      return;
    }

    setSyncing(type);

    try {
      const endpoint =
        type === 'square' ? '/api/sync/square-order' : '/api/sync/brevo-contact';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        alert(`${type} sync completed successfully!`);
        fetchSyncLogs(); // Refresh logs
      } else {
        alert(`${type} sync failed. Check logs for details.`);
      }
    } catch (error) {
      console.error(`${type} sync error:`, error);
      alert(`${type} sync failed. Check logs for details.`);
    }

    setSyncing(null);
  };

  const getStatusBadge = (status: string) => {
    return status === 'success' ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
        ✓ Success
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
        ✗ Error
      </span>
    );
  };

  const getServiceBadge = (service: string) => {
    return service === 'square' ? (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
        Square
      </span>
    ) : (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
        Brevo
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const squareLogs = syncLogs.filter((log) => log.service === 'square');
  const brevoLogs = syncLogs.filter((log) => log.service === 'brevo');
  const recentErrors = syncLogs.filter((log) => log.status === 'error').slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600 mt-1">Monitor and manage Square and Brevo synchronization</p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Square Integration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-3xl mr-3">💳</div>
              <div>
                <h2 className="text-lg font-bold">Square Payments</h2>
                <p className="text-sm text-gray-600">Order and payment sync</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Sync</span>
              <span className="font-medium">
                {squareLogs[0]
                  ? new Date(squareLogs[0].created_at).toLocaleString()
                  : 'Never'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium">
                {squareLogs.length > 0
                  ? `${((squareLogs.filter((l) => l.status === 'success').length / squareLogs.length) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleManualSync('square')}
            disabled={syncing === 'square'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {syncing === 'square' ? 'Syncing...' : 'Manual Sync'}
          </button>
        </div>

        {/* Brevo Integration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-3xl mr-3">📧</div>
              <div>
                <h2 className="text-lg font-bold">Brevo Email</h2>
                <p className="text-sm text-gray-600">Contact and marketing sync</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last Sync</span>
              <span className="font-medium">
                {brevoLogs[0]
                  ? new Date(brevoLogs[0].created_at).toLocaleString()
                  : 'Never'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium">
                {brevoLogs.length > 0
                  ? `${((brevoLogs.filter((l) => l.status === 'success').length / brevoLogs.length) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleManualSync('brevo')}
            disabled={syncing === 'brevo'}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 font-medium"
          >
            {syncing === 'brevo' ? 'Syncing...' : 'Manual Sync'}
          </button>
        </div>
      </div>

      {/* Recent Errors */}
      {recentErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-900 mb-4">⚠️ Recent Errors</h2>
          <div className="space-y-3">
            {recentErrors.map((log) => (
              <div key={log.id} className="bg-white rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getServiceBadge(log.service)}
                    <span className="text-sm font-medium">{log.operation}</span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-red-700">
                  {log.details?.error || 'Unknown error'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Sync Logs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Sync History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {syncLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No sync logs found
                  </td>
                </tr>
              ) : (
                syncLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{getServiceBadge(log.service)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {log.operation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(log.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                      {log.status === 'error'
                        ? log.details?.error || 'Error'
                        : log.details?.message || 'Success'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">🔧 Integration Guide</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Square webhook automatically syncs orders when they're created or updated</li>
          <li>• Brevo contacts are synced after each order to update customer attributes</li>
          <li>• Manual sync can be used to force synchronization for testing</li>
          <li>• Check sync logs regularly to ensure integrations are working properly</li>
          <li>• Contact support if error rate exceeds 5%</li>
        </ul>
      </div>
    </div>
  );
}
