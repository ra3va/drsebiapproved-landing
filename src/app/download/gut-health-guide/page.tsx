import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Download Your Gut Health Guide | Dr. Sebi Approved",
  description: "Download your free comprehensive gut health guide with Dr. Sebi's natural parasite cleanse protocols.",
  robots: "noindex, nofollow", // Keep this private for subscribers only
};

export default function GutHealthGuideDownload() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-[5.5rem]"></div>
      
      <main className="flex-1 bg-gradient-to-b from-green-50 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <Link href="/#blog">
            <Button variant="outline" className="mb-8 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-white shadow-xl border-green-200">
              <CardContent className="p-8 md:p-12 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Your Gut Health Guide is Ready! 🌿
                </h1>

                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Thank you for subscribing! Your comprehensive guide to Dr. Sebi's natural parasite cleanse protocols is ready for download.
                </p>

                {/* Download Button */}
                <div className="mb-8">
                  <a 
                    href="/guthealthguide.pdf"
                    download="Dr-Sebi-Gut-Health-Guide.pdf"
                    className="inline-flex items-center gap-3 bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-6 h-6" />
                    Download Your Guide (PDF)
                  </a>
                </div>

                {/* What's Inside */}
                <div className="bg-green-50 p-6 rounded-xl mb-8">
                  <h3 className="text-xl font-bold text-green-900 mb-4">What's Inside Your Guide:</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">Hidden signs of parasite infection</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">Dr. Sebi's natural removal protocols</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">Anti-parasitic foods and herbs</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">Gut rebuilding strategies</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">30-day cleanse protocol</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">Maintenance guidelines</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">📧 What Happens Next?</h3>
                  <p className="text-blue-800 mb-4">
                    Over the next few days, you'll receive additional insights about natural gut health and wellness. 
                    Keep an eye on your inbox for exclusive content and special offers!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/#elite-package"
                      className="inline-flex items-center justify-center px-6 py-3 text-[#00A6E6] bg-white border-2 border-[#00A6E6] rounded-full hover:bg-blue-50 transition-all duration-200 font-semibold"
                    >
                      Explore ParaCleanse Elite
                    </Link>
                    <Link 
                      href="/#blog"
                      className="inline-flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Continue Reading Blog
                    </Link>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}