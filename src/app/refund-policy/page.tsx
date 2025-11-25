import Header from "@/components/Header"
import Link from "next/link"

export const metadata = {
    title: 'Refund & Exchange Policy | Dr. Sebi Approved',
    description: 'Refund and Exchange Policy for Dr. Sebi Approved - Learn about our shipping, refund, and exchange policies.',
}

export default function RefundPolicyPage() {
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

                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Refund & Exchange Policy</h1>

                    <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping & Processing</h2>
                            <p>
                                At drsebiapproved.com we strive to process and ship your order as quickly as possible. Please allow up to 3-5 business days for processing, after which your order will be shipped out. In most cases, your order will be shipped within 3 business days from the time your order is placed on our website, excluding Saturdays, Sundays, and holidays.
                            </p>
                            <p>
                                Please note that once you receive a confirmation email, no cancellations or modifications can be made to your order. In the rare event that your order does not ship within the specified time frame, our customer service team will notify you via email and provide an explanation for the delay.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Responsibility</h2>
                            <p>
                                It is important to understand that drsebiapproved.com is responsible for packaging and shipping your order. We can provide evidence of the date the package was shipped, along with a receipt. Our liability ends once the product has been shipped.
                            </p>
                            <p>
                                Upon delivery, you have a 72-hour window to notify us of any product errors or issues.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy</h2>
                            <p className="font-semibold text-gray-900">
                                Due to the nature of our products being considered food items, we do not offer refunds on shipped products under any circumstances.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchange Policy</h2>
                            <p>
                                We do allow exchanges within 21 days of delivery, subject to the following conditions:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>The item must be unopened and in its original packaging.</li>
                                <li>The customer is responsible for shipping the item back to us at their own expense.</li>
                                <li>Once we receive the unopened item, we will ship the replacement product to the customer at our expense.</li>
                            </ul>
                            <p className="mt-4">
                                To initiate an exchange, please contact our customer service team within 21 days of receiving your order. They will guide you through the process and provide you with the necessary shipping information.
                            </p>
                        </section>

                        <section className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <p>
                                We appreciate your understanding and cooperation with our shipping, refund, and exchange policies. If you have any further questions or concerns, please do not hesitate to contact our customer service team at{' '}
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
