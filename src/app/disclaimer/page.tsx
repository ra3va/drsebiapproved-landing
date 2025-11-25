import Header from "@/components/Header"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export const metadata = {
    title: 'Health Disclaimer | Dr. Sebi Approved',
    description: 'Important health disclaimer and educational information about Dr. Sebi Approved products.',
}

export default function DisclaimerPage() {
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

                    <div className="flex items-start gap-4 mb-8">
                        <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Health Disclaimer</h1>
                            <p className="text-lg text-gray-600">Important Information About Our Products</p>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
                            <p className="text-gray-800 leading-relaxed font-medium">
                                This information is for educational purposes only. This information has not been evaluated by the Food and Drug Administration. This information is not intended to diagnose, treat, cure, or prevent any disease. This is not a substitute for treatment advice, diagnosis or advice by a licensed physician. This is not meant to cover all possible precautions, circumstances, drug interactions, or adverse effects. You should seek prompt medical care if any health issues arise and consult your doctor before using alternative medicine or making a change to your routine.
                            </p>
                        </div>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">FDA Disclaimer</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These statements have not been evaluated by the Food and Drug Administration (FDA). The products and information on this website are not intended to diagnose, treat, cure, or prevent any disease.
                            </p>
                        </section>

                        <section className="space-y-4 mt-8">
                            <h2 className="text-2xl font-bold text-gray-900">Educational Purpose Only</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The content provided on drsebiapproved.com is for educational and informational purposes only. It is designed to help you make informed decisions about your health and wellness.
                            </p>
                        </section>

                        <section className="space-y-4 mt-8">
                            <h2 className="text-2xl font-bold text-gray-900">Consult Your Healthcare Provider</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Before using any of our products or making changes to your health routine, you should consult with a qualified healthcare professional. This is especially important if you:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Have a pre-existing medical condition</li>
                                <li>Are pregnant or nursing</li>
                                <li>Are taking prescription medications</li>
                                <li>Are under 18 years of age</li>
                                <li>Have allergies to herbs or natural ingredients</li>
                            </ul>
                        </section>

                        <section className="space-y-4 mt-8">
                            <h2 className="text-2xl font-bold text-gray-900">Individual Results May Vary</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Results from using our products may vary from person to person. The testimonials and examples provided on this website are individual experiences and are not guaranteed results for all users.
                            </p>
                        </section>

                        <section className="space-y-4 mt-8">
                            <h2 className="text-2xl font-bold text-gray-900">Product Safety</h2>
                            <p className="text-gray-700 leading-relaxed">
                                While our products are made with natural ingredients following traditional formulas, they are not meant to cover all possible precautions, circumstances, drug interactions, or adverse effects. Always read product labels and follow instructions carefully.
                            </p>
                        </section>

                        <section className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                If you experience any adverse reactions or health issues while using our products, discontinue use immediately and seek medical attention. For questions about our products, please contact us at{' '}
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
                        <p className="text-xs text-gray-500">
                            These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
