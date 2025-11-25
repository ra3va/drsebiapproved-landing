import Header from "@/components/Header"
import { Leaf } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: 'Terms of Service | Dr. Sebi Approved',
    description: 'Terms of Service for Dr. Sebi Approved - Read our terms and conditions for using our website and purchasing our products.',
}

export default function TermsOfServicePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white pt-[4.5rem]">
            <Header />

            <main className="flex-1">
                <div className="container px-4 md:px-6 max-w-4xl mx-auto py-12 md:py-16">
                    <div className="mb-8">
                        <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium">
                            ← Back to Home
                        </Link>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>

                    <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
                        <p>
                            Welcome to drsebiapproved.com. By accessing or using our website, you agree to be bound by the following terms and conditions (the "Terms of Service"), as well as our Privacy Policy. If you do not agree to these Terms of Service, please do not use our website.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Use of Website</h2>
                            <p>
                                The content on drsebiapproved.com is for informational and educational purposes only. By using this website, you agree that you are solely responsible for your use of the information provided and any products purchased through the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property</h2>
                            <p>
                                All content on drsebiapproved.com including text, graphics, logos, images, and software, is the property of drsebiapproved.com and is protected by United States and international copyright laws. You may not reproduce, modify, distribute, transmit, display, publish, or create derivative works from the content without our prior written consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Product Information</h2>
                            <p>
                                We strive to provide accurate and up-to-date information about our products. However, we do not warrant that the product descriptions, colors, or other content on the website are accurate, complete, reliable, current, or error-free.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ordering and Payment</h2>
                            <p>
                                When you place an order on drsebiapproved.com you agree to provide accurate and complete information. We reserve the right to refuse or cancel any order at any time and for any reason. We accept various forms of payment, which will be specified during the checkout process.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Shipping and Delivery</h2>
                            <p>
                                We process and ship orders as described in our Shipping Policy. We are not responsible for any delays or damages that occur during shipping. You agree to provide a valid shipping address and to comply with our Shipping Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Returns and Exchanges</h2>
                            <p>
                                Our <Link href="/refund-policy" className="text-primary hover:text-primary/80 underline">Refund and Exchange Policy</Link> governs all returns and exchanges. By placing an order on drsebiapproved.com you agree to comply with the terms outlined in this policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links</h2>
                            <p>
                                Our website may contain links to third-party websites. We are not responsible for the content or practices of these websites. By accessing third-party links, you acknowledge that you do so at your own risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
                            <p>
                                The information and products on drsebiapproved.com are provided "as is" and without warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, error-free, or free from viruses or other harmful components.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                            <p>
                                In no event shall drsebiapproved.com, its owners, employees, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of this website or the products purchased through it.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
                            <p>
                                These Terms of Service shall be governed by and construed in accordance with the laws of the State of Texas, without giving effect to any principles of conflicts of law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms of Service</h2>
                            <p>
                                We reserve the right to modify these Terms of Service at any time. Any changes will be posted on this page, and your continued use of the website after such changes constitutes your acceptance of the new Terms of Service.
                            </p>
                        </section>

                        <section className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <p className="text-sm">
                                If you have any questions or concerns about these Terms of Service, please contact us at{' '}
                                <a href="mailto:info@drsebiwebsite.com" className="text-primary hover:text-primary/80 underline">
                                    info@drsebiwebsite.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="w-full border-t border-gray-200 bg-gray-50">
                <div className="container px-4 py-8 md:px-6">
                    <div className="text-center text-sm text-gray-600">
                        <p className="mb-2">© 2024 Dr. Sebi Approved LLC. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
