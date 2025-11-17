'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'course';
  file_url: string;
  thumbnail_url: string | null;
}

interface UserAccess {
  id: string;
  digital_product_id: string;
  granted_at: string;
  expires_at: string | null;
  digital_products: DigitalProduct;
}

export default function DigitalContentPage() {
  const [accessibleContent, setAccessibleContent] = useState<UserAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from('user_digital_access')
      .select('*, digital_products(*)')
      .eq('user_id', user.id)
      .order('granted_at', { ascending: false });

    setAccessibleContent((data || []) as UserAccess[]);
    setLoading(false);
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      video: '🎥',
      course: '🎓',
    };
    return icons[type] || '📦';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pdf: 'PDF Guide',
      video: 'Video Content',
      course: 'Online Course',
    };
    return labels[type] || type;
  };

  const handleDownload = async (content: UserAccess) => {
    if (!content.digital_products.file_url) {
      alert('Content not available');
      return;
    }

    // Open file URL in new tab
    window.open(content.digital_products.file_url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const activeContent = accessibleContent.filter(
    (c) => !c.expires_at || new Date(c.expires_at) > new Date()
  );
  const expiredContent = accessibleContent.filter(
    (c) => c.expires_at && new Date(c.expires_at) <= new Date()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Digital Content</h1>
        <p className="text-gray-600 mt-1">Access your purchased guides, videos, and courses</p>
      </div>

      {/* Active Content */}
      {activeContent.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Content Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeContent.map((access) => {
              const product = access.digital_products;
              return (
                <div key={access.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-6xl">
                    {product.thumbnail_url ? (
                      <img
                        src={product.thumbnail_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getTypeIcon(product.type)
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        {getTypeLabel(product.type)}
                      </span>
                      {access.expires_at && (
                        <span className="text-xs text-gray-600">
                          Expires {new Date(access.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                    <button
                      onClick={() => handleDownload(access)}
                      className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium transition-colors"
                    >
                      {product.type === 'pdf'
                        ? 'Download PDF'
                        : product.type === 'video'
                        ? 'Watch Video'
                        : 'Access Course'}
                    </button>

                    <div className="mt-3 text-xs text-gray-500">
                      Added {new Date(access.granted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expired Content */}
      {expiredContent.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Expired Content</h2>
          <div className="space-y-3">
            {expiredContent.map((access) => {
              const product = access.digital_products;
              return (
                <div
                  key={access.id}
                  className="bg-white rounded-lg shadow-sm p-4 opacity-50 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{getTypeIcon(product.type)}</div>
                    <div>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-sm text-gray-600">
                        Expired {new Date(access.expires_at!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                    Renew Access
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {accessibleContent.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-5xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Digital Content Yet</h2>
          <p className="text-gray-600 mb-6">
            Digital content like guides, videos, and courses you purchase will appear here.
          </p>
          <a
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
          >
            Browse Products
          </a>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">📖 About Digital Content</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Digital content is delivered instantly after purchase</li>
          <li>• PDF guides can be downloaded and saved to your device</li>
          <li>• Video content can be streamed unlimited times during access period</li>
          <li>• Course access includes all lessons and materials</li>
          <li>• Contact support if you have trouble accessing your content</li>
        </ul>
      </div>
    </div>
  );
}
