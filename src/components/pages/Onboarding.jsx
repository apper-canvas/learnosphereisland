import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Onboarding = () => {
  const [selectedInterests, setSelectedInterests] = useState([])
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const interests = [
    {
      id: 'agriculture',
      name: 'Agriculture',
      description: 'Sustainable farming, gardening, and agricultural techniques',
      icon: 'Sprout',
      color: 'bg-categories-agriculture'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      description: 'Nutrition, fitness, mental health, and lifestyle',
      icon: 'Heart',
      color: 'bg-categories-health'
    },
    {
      id: 'stocks',
      name: 'Stock Trading',
      description: 'Market analysis, investment strategies, and trading basics',
      icon: 'TrendingUp',
      color: 'bg-categories-stocks'
    },
    {
      id: 'finance',
      name: 'Personal Finance',
      description: 'Budgeting, saving, investing, and financial planning',
      icon: 'DollarSign',
      color: 'bg-categories-finance'
    }
  ]

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleContinue = () => {
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest to continue')
      return
    }

    // Store interests in localStorage for personalization
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests))
    
    toast.success('Welcome to LearnoSphere! Your preferences have been saved.')
    navigate('/')
  }

  const handleSkip = () => {
    localStorage.setItem('userInterests', JSON.stringify([]))
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="GraduationCap" size={32} className="text-white" />
          </div>
          
          <h1 className="font-display font-bold text-4xl text-gray-900 mb-4">
            Welcome to LearnoSphere
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let's personalize your learning experience. Select the topics that interest you most.
          </p>
        </div>

        {/* Interest Selection */}
        <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
          <h2 className="font-display font-semibold text-2xl text-gray-900 mb-2 text-center">
            What would you like to learn?
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Choose one or more subjects to get personalized course recommendations
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {interests.map((interest, index) => (
              <motion.button
                key={interest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleInterest(interest.id)}
                className={`p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedInterests.includes(interest.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${interest.color} text-white`}>
                    <ApperIcon name={interest.icon} size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">
                      {interest.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {interest.description}
                    </p>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedInterests.includes(interest.id)
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedInterests.includes(interest.id) && (
                      <ApperIcon name="Check" size={14} className="text-white" />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selection Counter */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {selectedInterests.length} of {interests.length} topics selected
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSkip}
              variant="ghost"
              size="lg"
              className="order-2 sm:order-1"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleContinue}
              size="lg"
              className="order-1 sm:order-2 flex items-center space-x-2"
              disabled={selectedInterests.length === 0}
            >
              <span>Continue to Dashboard</span>
              <ApperIcon name="ArrowRight" size={20} />
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-2 bg-primary rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
        </div>
      </motion.div>
    </div>
  )
}

export default Onboarding