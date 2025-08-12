"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Leaf, Shield, Brain, Battery, Coffee, Moon, Heart } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const questions = [
  {
    id: 1,
    question: "How often do you experience unexplained fatigue?",
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
  const [showResults, setShowResults] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

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
        setShowResults(true)
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

  const getRecommendation = (severity: string) => {
    switch (severity) {
      case "Low":
        return {
          title: "Preventive Care Recommended",
          description: "While your symptoms are mild, taking preventive measures can help maintain your health. Consider our gentle cleansing protocol to support your body's natural detox processes.",
          action: "Learn about our preventive cleansing options"
        }
      case "Moderate":
        return {
          title: "Cleansing Support Suggested",
          description: "Your symptoms suggest you could benefit from our comprehensive cleansing protocol. Our two-phase approach can help address your current concerns and prevent future issues.",
          action: "Explore our cleansing solutions"
        }
      case "High":
        return {
          title: "Immediate Action Recommended",
          description: "Your symptoms indicate a significant need for detoxification support. Our intensive cleansing protocol can help address these issues and restore your body's natural balance.",
          action: "Start your healing journey now"
        }
      default:
        return {
          title: "Assessment Needed",
          description: "Please complete the quiz to receive personalized recommendations.",
          action: "Take the quiz"
        }
    }
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
        
        {!showResults ? (
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
              <h1 className="text-4xl font-bold mb-4">Do You Need to Detox?</h1>
              <p className="text-lg text-muted-foreground">
                Answer these questions honestly to assess your body's potential need for cleansing.
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
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="mb-8 border-2 border-primary">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium mb-4">
                    Your Results
                  </span>
                  <h2 className="text-3xl font-bold mb-2">Your Personalized Assessment</h2>
                  <p className="text-lg text-muted-foreground">
                    Based on your responses, here's what we recommend:
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Detox Need Level:</span>
                      <span className="text-primary font-bold text-lg">{calculateScore().severity}</span>
                    </div>
                    <div className="relative">
                      <Progress value={calculateScore().percentage} className="h-4 rounded-lg" />
                      <div 
                        className="absolute top-full left-0 right-0 flex justify-between mt-2 text-sm text-muted-foreground"
                      >
                        <span>Low</span>
                        <span>Moderate</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/20 rounded-lg p-6">
                    <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      {getRecommendation(calculateScore().severity).title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {getRecommendation(calculateScore().severity).description}
                    </p>
                    <Button className="w-full bg-primary text-white hover:bg-primary/90 py-6 text-lg">
                      {getRecommendation(calculateScore().severity).action}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-bold mb-4 text-lg">Understanding Your Results:</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Your total score: {calculateScore().total} out of {questions.length * 3}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Severity level indicates recommended cleansing intensity
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Results based on common toxin buildup symptoms
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        This assessment is not a medical diagnosis
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
                  setSelectedOption(null)
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