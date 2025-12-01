"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Leaf, Shield, Brain, Battery, Coffee, Moon, Heart, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import * as fpixel from '@/lib/fpixel'

const questions = [
  {
    id: 1,
    question: "How often do you experience unexplained fatigue?",
    category: 'energy',
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "Once or twice a month", score: 1 },
      { text: "Weekly", score: 2 },
      { text: "Almost daily", score: 3 }
    ]
  },
  {
    id: 2,
    question: "Do you experience digestive issues like bloating, gas, or irregular bowel movements?",
    category: 'digestive',
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Frequently", score: 2 },
      { text: "Almost daily", score: 3 }
    ]
  },
  {
    id: 3,
    question: "How would you rate your mental clarity and focus?",
    category: 'mental',
    options: [
      { text: "Excellent - Always sharp", score: 0 },
      { text: "Good - Occasional fog", score: 1 },
      { text: "Fair - Regular brain fog", score: 2 },
      { text: "Poor - Frequent confusion", score: 3 }
    ]
  },
  {
    id: 4,
    question: "Do you experience frequent headaches or migraines?",
    category: 'mental',
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "1-2 times per month", score: 1 },
      { text: "Weekly", score: 2 },
      { text: "Multiple times per week", score: 3 }
    ]
  },
  {
    id: 5,
    question: "How would you describe your sleep quality?",
    category: 'energy',
    options: [
      { text: "Excellent - Wake up refreshed", score: 0 },
      { text: "Good - Occasional restlessness", score: 1 },
      { text: "Fair - Often wake up tired", score: 2 },
      { text: "Poor - Consistently unrested", score: 3 }
    ]
  },
  {
    id: 6,
    question: "Do you experience unexplained mood swings or irritability?",
    category: 'mental',
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Frequently", score: 2 },
      { text: "Almost daily", score: 3 }
    ]
  },
  {
    id: 7,
    question: "How often do you experience food cravings, especially for sugar or carbs?",
    category: 'digestive',
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Frequently", score: 2 },
      { text: "Almost constantly", score: 3 }
    ]
  },
  {
    id: 8,
    question: "Do you have skin issues like rashes, acne, or unexplained itching?",
    category: 'digestive',
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Frequently", score: 2 },
      { text: "Constantly", score: 3 }
    ]
  },
  {
    id: 9,
    question: "How would you rate your immune system strength?",
    category: 'immunity',
    options: [
      { text: "Very strong - Rarely get sick", score: 0 },
      { text: "Good - Get sick 1-2 times a year", score: 1 },
      { text: "Fair - Get sick several times a year", score: 2 },
      { text: "Poor - Frequently ill", score: 3 }
    ]
  },
  {
    id: 10,
    question: "Do you experience joint pain or muscle aches without obvious cause?",
    category: 'energy',
    options: [
      { text: "Rarely or never", score: 0 },
      { text: "Occasionally", score: 1 },
      { text: "Frequently", score: 2 },
      { text: "Almost daily", score: 3 }
    ]
  }
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // Email capture states
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleAnswer = (score: number) => {
    setSelectedOption(score)
    setTimeout(() => {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = score
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // Track quiz completion (before email capture)
        if (typeof window !== 'undefined' && (window as any).Brevo) {
          (window as any).Brevo.push(['track', 'quiz_completed', {
            total_score: newAnswers.reduce((a, b) => a + b, 0),
            question_count: questions.length
          }]);
        }
        setShowEmailCapture(true)
      }
    }, 300)
  }

  const calculateScore = () => {
    const total = answers.reduce((acc, curr) => acc + curr, 0)
    const maxScore = questions.length * 3
    return {
      total,
      percentage: (total / maxScore) * 100,
      severity: total <= 10 ? "Low" : total <= 20 ? "Moderate" : "High"
    }
  }

  // Symptom-based product recommendation (smarter than just score)
  const getProductRecommendation = () => {
    const categoryScores: Record<string, number> = {
      energy: 0,
      digestive: 0,
      mental: 0,
      immunity: 0
    }

    // Calculate scores by category
    questions.forEach((q, index) => {
      if (categoryScores[q.category] !== undefined) {
        categoryScores[q.category] += answers[index] || 0
      }
    })

    // Find dominant symptom category
    const dominantCategory = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)[0][0]

    // Map category to product
    const productMap: Record<string, { product: string, problem: string, productName: string }> = {
      digestive: { product: 'paracleanse', problem: 'digestive', productName: 'ParaCleanse Elite' },
      energy: { product: 'maya', problem: 'fatigue', productName: 'Maya Formula' },
      mental: { product: 'maya', problem: 'fatigue', productName: 'Maya Formula' },
      immunity: { product: 'seamoss', problem: 'immunity', productName: 'Sea Moss Capsules' }
    }

    return productMap[dominantCategory] || productMap.digestive
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const score = calculateScore()
      const recommendation = getProductRecommendation()

      // Submit to Brevo
      const response = await fetch('/api/brevo/quiz-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          quizAnswers: answers,
          totalScore: score.total,
          severityLevel: score.severity.toLowerCase(),
          recommendedProduct: recommendation.product,
          primaryProblem: recommendation.problem
        })
      })

      const result = await response.json()

      if (result.success) {
        // Track Lead event on Facebook Pixel
        fpixel.event('Lead', {
          content_name: 'Health Assessment Quiz',
          content_category: 'Lead Generation',
          value: 0,
          currency: 'USD'
        });

        // Identify user for behavioral tracking
        if (typeof window !== 'undefined' && (window as any).Brevo) {
          (window as any).Brevo.push(['identify', {
            email: email,
            firstname: firstName,
            quiz_score: score.total,
            recommended_product: recommendation.product,
            source: new URLSearchParams(window.location.search).get('utm_source') || 'quiz'
          }]);
        }

        setShowEmailCapture(false)
        setShowResults(true)
      } else {
        throw new Error(result.message || 'Failed to submit quiz')
      }
    } catch (error: any) {
      console.error('Quiz submission error:', error)
      setSubmitError('Sorry, there was an error. Please try again.')
      // Show results anyway - don't block user experience
      setTimeout(() => {
        setShowEmailCapture(false)
        setShowResults(true)
      }, 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRecommendationDetails = (severity: string, product: string, productName: string) => {
    const severityMessages: Record<string, string> = {
      Low: "Your symptoms are mild, but prevention is key to long-term health.",
      Moderate: "Your symptoms suggest your body needs support to restore balance.",
      High: "Your symptoms indicate a significant need for natural healing support."
    }

    const productDescriptions: Record<string, string> = {
      paracleanse: "Our two-phase internal cleansing system is designed to support gentle detoxification and digestive wellness.",
      maya: "Dr. Sebi's iron-rich 26-herb formula supports blood, brain, and nervous system health.",
      seamoss: "Wildcrafted sea moss with 92 essential minerals supports thyroid, immunity, and energy.",
      'mucus-cleanser': "Powerful blend supports healthy mucus balance and respiratory wellness."
    }

    return {
      title: `We Recommend: ${productName}`,
      severityMessage: severityMessages[severity],
      description: productDescriptions[product],
      benefits: getProductBenefits(product)
    }
  }

  const getProductBenefits = (product: string): string[] => {
    const benefits: Record<string, string[]> = {
      paracleanse: [
        "Supports your body's natural detoxification processes",
        "Helps maintain a clean internal environment",
        "Supports digestive comfort and regularity",
        "Pairs well with dietary and lifestyle changes"
      ],
      maya: [
        "Increases energy and vitality",
        "Enhances mental clarity",
        "Supports blood purification",
        "Boosts iron levels naturally"
      ],
      seamoss: [
        "92 essential minerals",
        "Supports thyroid function",
        "Boosts immune system",
        "Increases natural energy"
      ],
      'mucus-cleanser': [
        "Supports healthy mucus levels",
        "Supports respiratory health",
        "Cellular cleansing support",
        "Natural congestion comfort"
      ]
    }
    return benefits[product] || benefits.paracleanse
  }

  const getQuestionIcon = (questionId: number) => {
    switch (questionId) {
      case 1: return <Battery className="h-6 w-6" />
      case 2: return <Heart className="h-6 w-6" />
      case 3: return <Brain className="h-6 w-6" />
      case 4: return <Coffee className="h-6 w-6" />
      case 5: return <Moon className="h-6 w-6" />
      default: return <Shield className="h-6 w-6" />
    }
  }

  const recommendation = getProductRecommendation()
  const score = calculateScore()
  const details = getRecommendationDetails(score.severity, recommendation.product, recommendation.productName)

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/50 to-white">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <Leaf className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <span className="ml-2 text-lg md:text-2xl font-bold text-foreground whitespace-nowrap">Dr. Sebi Approved LLC</span>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl transform rotate-3 -z-10"></div>

        {/* QUIZ QUESTIONS */}
        {!showEmailCapture && !showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <h1 className="text-4xl font-bold mb-4">Discover Your Personalized Wellness Protocol</h1>
              <p className="text-lg text-muted-foreground">
                Answer these questions honestly to receive a customized health recommendation.
              </p>
            </div>

            <div className="relative mb-8">
              <Progress
                value={(currentQuestion / questions.length) * 100}
                className="h-3"
              />
              <span className="absolute right-0 top-4 text-sm text-muted-foreground">
                {Math.round((currentQuestion / questions.length) * 100)}% Complete
              </span>
            </div>

            <Card className="mb-8 border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getQuestionIcon(questions[currentQuestion].id)}
                  </div>
                  <h2 className="text-2xl font-semibold">
                    {questions[currentQuestion].question}
                  </h2>
                </div>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full text-left justify-start h-auto py-4 px-6 ${
                          selectedOption === option.score
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary hover:bg-primary/5'
                        }`}
                        onClick={() => handleAnswer(option.score)}
                      >
                        {option.text}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  setSelectedOption(null)
                }}
                className="gap-2"
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(questions.length)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === currentQuestion
                        ? 'bg-primary'
                        : i < currentQuestion
                          ? 'bg-primary/50'
                          : 'bg-primary/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* EMAIL CAPTURE SCREEN */}
        {showEmailCapture && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2 border-primary">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Get Your Personalized Results</h2>
                  <p className="text-muted-foreground text-lg">
                    Enter your email to receive your customized health protocol and product recommendations.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {submitError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Get My Results →
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    We respect your privacy. No spam, unsubscribe anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* RESULTS SCREEN */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="mb-8 border-2 border-primary">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                    Your Personalized Assessment
                  </span>
                  <h2 className="text-3xl font-bold mb-2">
                    {firstName ? `${firstName}, h` : 'H'}ere's Your Custom Protocol
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Based on your symptoms, we've identified the perfect solution for you.
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Wellness Need Level:</span>
                      <span className="text-primary font-bold text-lg">{score.severity}</span>
                    </div>
                    <div className="relative">
                      <Progress value={score.percentage} className="h-4 rounded-lg" />
                      <div className="absolute top-full left-0 right-0 flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>Low</span>
                        <span>Moderate</span>
                        <span>High</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      {details.severityMessage}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border-2 border-primary/20">
                    <h3 className="font-bold text-2xl mb-2 text-primary">
                      {details.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {details.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <p className="font-semibold">Key Benefits:</p>
                      {details.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={`/${recommendation.product}`}>
                      <Button className="w-full bg-primary text-white hover:bg-primary/90 py-6 text-lg">
                        Start My {recommendation.productName} Protocol →
                      </Button>
                    </Link>
                  </div>

                  {/* Understanding Results */}
                  <div className="border-t pt-6">
                    <h3 className="font-bold mb-4 text-lg">What Happens Next:</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Check your email{firstName && ` (${email})`} for your detailed results and protocol guide</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Learn more about {recommendation.productName} and how it addresses your specific symptoms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span>Receive personalized wellness tips over the next few days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                        <span className="text-xs">This assessment is for educational purposes only and is not medical advice</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers([])
                  setShowResults(false)
                  setShowEmailCapture(false)
                  setSelectedOption(null)
                  setEmail('')
                  setFirstName('')
                }}
                className="rounded-full px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Take Quiz Again
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
