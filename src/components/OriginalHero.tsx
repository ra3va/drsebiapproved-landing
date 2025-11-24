'use client';

import { Leaf } from 'lucide-react';

export default function OriginalHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-accent/10 pt-16 pb-12">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="container relative mx-auto px-4 max-w-[1200px]">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
            <Leaf className="w-4 h-4 mr-2" />
            <span>DR. SEBI'S AUTHENTIC FORMULAS</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
            Transform Your Health with
            <span className="text-primary block">Dr. Sebi's Natural</span>
            <span className="text-green-600 block">Healing Solutions</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-[700px] mx-auto leading-relaxed">
            Discover authentic Dr. Sebi approved products for complete body wellness. From parasite cleansing to mineral supplementation, experience the power of nature's most effective healing compounds.
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-[600px] mx-auto border rounded-xl p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-1">30+</div>
              <div className="text-sm text-muted-foreground">Years Legacy</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Natural</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
