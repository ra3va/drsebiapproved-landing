'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const problems = [
  {
    id: 'fatigue',
    title: 'Chronic Fatigue & Brain Fog',
    icon: '😴',
    product: 'maya',
    description: 'Feel drained no matter how much you sleep?',
    symptoms: ['Constant tiredness', 'Poor focus & mental fog', 'Low motivation', 'Weakened immune system']
  },
  {
    id: 'digestive',
    title: 'Digestive Issues & Parasites',
    icon: '🦠',
    product: 'paracleanse',
    description: 'Bloating, gas, and unexplained discomfort?',
    symptoms: ['Bloating & gas', 'Irregular bowels', 'Unexplained pain', 'Food sensitivities']
  },
  {
    id: 'immunity',
    title: 'Low Energy & Weak Immunity',
    icon: '⚡',
    product: 'seamoss',
    description: 'Getting sick often and feeling run down?',
    symptoms: ['Frequent illness', 'Low energy levels', 'Slow recovery', 'Nutrient deficiency']
  },
  {
    id: 'respiratory',
    title: 'Respiratory & Mucus Issues',
    icon: '🫁',
    product: 'mucus-cleanser',
    description: 'Excess mucus and breathing difficulties?',
    symptoms: ['Excess mucus', 'Congestion', 'Breathing issues', 'Sinus problems']
  }
];

export default function ProblemNavigation() {
  const router = useRouter();

  const handleProblemClick = async (problem: typeof problems[0]) => {
    // Track client-side with Brevo behavioral tracking
    if (typeof window !== 'undefined' && (window as any).Brevo) {
      (window as any).Brevo.push(['track', 'problem_selected', {
        problem: problem.id,
        product: problem.product,
        source: new URLSearchParams(window.location.search).get('utm_source') || 'direct'
      }]);
    }

    // Optional: Track server-side for logged-in users
    try {
      await fetch('/api/brevo/track-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: problem.id,
          productClicked: problem.product,
          source: new URLSearchParams(window.location.search).get('utm_source') || 'homepage'
        })
      });
    } catch (error) {
      // Fail silently - don't block navigation
      console.error('Problem tracking error:', error);
    }

    // Navigate to product page
    router.push(`/${problem.product}`);
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-accent/10">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Health Challenge Are You Facing?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your primary concern and discover Dr. Sebi's natural solution designed specifically for your needs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {problems.map((problem) => (
            <Card
              key={problem.id}
              className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 cursor-pointer group hover:shadow-lg"
              onClick={() => handleProblemClick(problem)}
            >
              <CardContent className="p-6 text-center">
                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {problem.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {problem.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4 text-sm">
                  {problem.description}
                </p>

                {/* Symptoms List */}
                <div className="space-y-2 text-left text-sm mb-4">
                  {problem.symptoms.map((symptom, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{symptom}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-4 text-primary font-medium group-hover:underline flex items-center justify-center gap-2">
                  <span>Explore Solution</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quiz CTA */}
        <div className="text-center bg-white rounded-2xl p-8 max-w-2xl mx-auto border-2 border-primary/20 shadow-md">
          <h3 className="text-2xl font-bold mb-3">
            Not Sure Which Solution Is Right For You?
          </h3>
          <p className="text-muted-foreground mb-6">
            Take our 60-second health assessment and get a personalized protocol recommendation based on your symptoms.
          </p>
          <Button
            onClick={() => {
              // Track quiz CTA click
              if (typeof window !== 'undefined' && (window as any).Brevo) {
                (window as any).Brevo.push(['track', 'quiz_cta_clicked', {
                  source: 'problem-navigation-section'
                }]);
              }
              router.push('/quiz');
            }}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:translate-y-[1px] transition-all"
          >
            Take Our Health Quiz →
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Free • 60 seconds • Personalized results
          </p>
        </div>
      </div>
    </section>
  );
}
