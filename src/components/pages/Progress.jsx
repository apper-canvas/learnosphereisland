import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ProgressRing from '@/components/atoms/ProgressRing'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { courseService, userProgressService, badgeService } from '@/services'

const Progress = () => {
  const [progressData, setProgressData] = useState([])
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    learningStreak: 0,
    totalHours: 0
  })

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    try {
      setLoading(true)

      // Load user progress
      const progressList = await userProgressService.getAll()
      
      // Load courses with progress
      const coursesWithProgress = []
      for (const progress of progressList) {
        const course = await courseService.getById(progress.courseId)
        if (course) {
          coursesWithProgress.push({
            course,
            progress,
            categoryColor: getCategoryColor(course.category)
          })
        }
      }
      setProgressData(coursesWithProgress)

      // Load badges
      const allBadges = await badgeService.getAll()
      setBadges(allBadges)

      // Calculate stats
      const totalCourses = coursesWithProgress.length
      const completedCourses = coursesWithProgress.filter(({ progress }) => progress.percentComplete === 100).length
      const totalLessons = coursesWithProgress.reduce((acc, { course }) => acc + course.lessons.length, 0)
      const completedLessons = coursesWithProgress.reduce((acc, { progress }) => acc + progress.completedLessons.length, 0)
      const totalHours = coursesWithProgress.reduce((acc, { course }) => acc + course.duration, 0)
      
      // Calculate learning streak (simplified - days with activity)
      const recentDays = coursesWithProgress.filter(({ progress }) => {
        const lastAccessed = new Date(progress.lastAccessed)
        const daysDiff = Math.floor((new Date() - lastAccessed) / (1000 * 60 * 60 * 24))
        return daysDiff <= 7
      }).length

      setStats({
        totalCourses,
        completedCourses,
        totalLessons,
        completedLessons,
        learningStreak: recentDays,
        totalHours: Math.round(totalHours / 60)
      })

    } catch (error) {
      console.error('Failed to load progress data:', error)
      toast.error('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      agriculture: '#51CF66',
      health: '#FF6B6B',
      stocks: '#4DABF7',
      finance: '#FFD43B'
    }
    return colors[category] || '#4C6EF5'
  }

  const getOverallProgress = () => {
    if (stats.totalLessons === 0) return 0
    return Math.round((stats.completedLessons / stats.totalLessons) * 100)
  }

  const earnedBadges = badges.filter(badge => badge.earnedDate)
  const unearnedBadges = badges.filter(badge => !badge.earnedDate)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-gray-900 mb-4">
              Your Learning Progress
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your achievements, monitor your learning streak, and celebrate your milestones.
            </p>
          </motion.div>

          {/* Overall Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-card p-8 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  Overall Progress
                </h2>
                <p className="text-gray-600 mb-4">
                  You've completed {stats.completedLessons} out of {stats.totalLessons} lessons
                </p>
                <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="BookOpen" size={16} />
                    <span>{stats.totalCourses} courses enrolled</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={16} />
                    <span>{stats.totalHours} hours of content</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <ProgressRing 
                  progress={getOverallProgress()} 
                  size={120}
                  strokeWidth={8}
                  color="#4C6EF5"
                  className="mb-4"
                />
                <div className="text-sm text-gray-600">
                  {getOverallProgress()}% Complete
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Course Progress */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-2xl text-gray-900">
                  Course Progress
                </h2>
                <Button 
                  as={Link} 
                  to="/my-learning" 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ApperIcon name="ArrowRight" size={16} />
                </Button>
              </div>

              {progressData.length > 0 ? (
                <div className="space-y-4">
                  {progressData.map(({ course, progress, categoryColor }, index) => (
                    <motion.div
                      key={course.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-lg shadow-card p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${categoryColor}20` }}
                          >
                            <ApperIcon 
                              name={course.category === 'agriculture' ? 'Sprout' : 
                                    course.category === 'health' ? 'Heart' :
                                    course.category === 'stocks' ? 'TrendingUp' : 'DollarSign'} 
                              size={20} 
                              style={{ color: categoryColor }}
                            />
                          </div>
                          
                          <div>
                            <h3 className="font-display font-semibold text-lg text-gray-900">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {progress.completedLessons.length} of {course.lessons.length} lessons
                            </p>
                          </div>
                        </div>

                        <ProgressRing 
                          progress={progress.percentComplete} 
                          size={60}
                          color={categoryColor}
                        />
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: categoryColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.percentComplete}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          Last accessed {new Date(progress.lastAccessed).toLocaleDateString()}
                        </span>
                        <Button 
                          as={Link}
                          to={`/courses/${course.Id}`}
                          size="sm"
                          variant="outline"
                        >
                          {progress.percentComplete === 100 ? 'Review' : 'Continue'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="BarChart3" size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-lg text-gray-600 mb-2">
                    No progress to show
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start learning to see your progress here
                  </p>
                  <Button as={Link} to="/courses">
                    Browse Courses
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats Cards */}
              <div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                  Learning Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Completed', value: stats.completedCourses, icon: 'CheckCircle', color: 'text-success' },
                    { label: 'Streak Days', value: stats.learningStreak, icon: 'Flame', color: 'text-warning' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      className="bg-white rounded-lg p-4 shadow-card text-center"
                    >
                      <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                        <ApperIcon name={stat.icon} size={20} />
                      </div>
                      <div className="text-xl font-bold font-display text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                  Achievements
                </h3>
                
                {earnedBadges.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Earned Badges</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {earnedBadges.slice(0, 4).map((badge) => (
                          <Badge
                            key={badge.Id}
                            name={badge.name}
                            description={badge.description}
                            icon={badge.icon}
                            earnedDate={badge.earnedDate}
                          />
                        ))}
                      </div>
                    </div>

                    {unearnedBadges.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Available Badges</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {unearnedBadges.slice(0, 4).map((badge) => (
                            <Badge
                              key={badge.Id}
                              name={badge.name}
                              description={badge.description}
                              icon={badge.icon}
                              earnedDate={null}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="Award" size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Complete lessons to earn your first badge
                    </p>
                  </div>
                )}
              </div>

              {/* Learning Motivation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Target" size={24} className="text-white" />
                  </div>
                  <h4 className="font-display font-semibold text-lg text-gray-900 mb-2">
                    Keep Learning!
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    You're making great progress. Keep up the momentum!
                  </p>
                  <Button as={Link} to="/courses" size="sm" className="w-full">
                    Explore More Courses
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Progress