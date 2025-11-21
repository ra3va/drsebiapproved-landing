import { useState, useEffect, useRef } from 'react'
import { CustomerDetails } from '../types'

export function useCheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Customer details state
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')

  // Scroll to top when step changes
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentStep])

  // Validate step before proceeding
  const validateStep = (step: number): boolean => {
    setError(null)

    if (step === 1) {
      if (!email || !fullName) {
        setError('Please fill in your email and full name')
        return false
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email address')
        return false
      }
    }

    if (step === 2) {
      if (!address || !city || !state || !zipCode) {
        setError('Please fill in all shipping address fields')
        return false
      }
      if (zipCode.length < 5) {
        setError('Please enter a valid ZIP code')
        return false
      }
    }

    return true
  }

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const goToPreviousStep = () => {
    setError(null)
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const getCustomerDetails = (): CustomerDetails => {
    return {
      email,
      name: fullName,
      phone,
      address: {
        addressLine1: address,
        locality: city,
        administrativeDistrictLevel1: state,
        postalCode: zipCode,
        country: 'US'
      }
    }
  }

  return {
    currentStep,
    error,
    setError,
    formRef,
    goToNextStep,
    goToPreviousStep,
    validateStep,
    getCustomerDetails,
    // Form fields
    email,
    setEmail,
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode
  }
}
