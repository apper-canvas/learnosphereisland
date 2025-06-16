import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import CourseCard from '@/components/molecules/CourseCard'
import ProgressRing from '@/components/atoms/ProgressRing'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { courseService, userProgressService } from '@/services'

const MyLearning = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, in-progress, completed

  useEffect(() => {
    loadEnrolledCourses()
  }, [])

  const loadEnrolledCourses = async () => {
    try {
      setLoading(true)
      
      // Load user progress
      const progressData = await userProgressService.getAll()
      
      // Load courses with progress
      const coursesWithProgress = []
      for (const progress of progressData) {
        const course = await courseService.getById(progress.courseId)
        if (course) {
          coursesWithProgress.push({
            course,
            progress,
            lastAccessed: new Date(progress.lastAccessed)
          })
        }
      }

      // Sort by last accessed
      coursesWithProgress.sort((a, b) => b.lastAccessed - a.lastAccessed)
      setEnrolledCourses(coursesWithProgress)

    } catch (error) {
      console.error('Failed to load enrolled courses:', error)
      toast.error('Failed to load your courses')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredCourses = () => {
    switch (filter) {
      case 'in-progress':
        return enrolledCourses.filter(({ progress }) => 
          progress.percentComplete > 0 && progress.percentComplete < 100
        )
      case 'completed':
        return enrolledCourses.filter(({ progress }) => 
          progress.percentComplete === 100
        )
      default:
        return enrolledCourses
    }
  }

  const getStats = () => {
    const total = enrolledCourses.length
    const completed = enrolledCourses.filter(({ progress }) => progress.percentComplete === 100).length
    const inProgress = enrolledCourses.filter(({ progress }) => 
      progress.percentComplete > 0 && progress.percentComplete < 100
    ).length
    const totalHours = enrolledCourses.reduce((acc, { course }) => acc + course.duration, 0)

    return { total, completed, inProgress, totalHours: Math.round(totalHours / 60) }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const filteredCourses = getFilteredCourses()
  const stats = getStats()

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
              My Learning Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your progress and continue learning at your own pace.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Courses', value: stats.total, icon: 'BookOpen', color: 'text-primary' },
              { label: 'In Progress', value: stats.inProgress, icon: 'Play', color: 'text-warning' },
              { label: 'Completed', value: stats.completed, icon: 'CheckCircle', color: 'text-success' },
              { label: 'Learning Hours', value: stats.totalHours, icon: 'Clock', color: 'text-secondary' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-card text-center"
              >
                <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                  <ApperIcon name={stat.icon} size={24} />
                </div>
                <div className="text-2xl font-bold font-display text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {enrolledCourses.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="BookOpen" size={32} className="text-gray-400" />
              </div>
              
              <h2 className="font-display font-semibold text-2xl text-gray-600 mb-4">
                No courses enrolled yet
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start your learning journey by exploring our diverse course catalog 
                and enrolling in courses that interest you.
              </p>
              
              <Button as={Link} to="/courses" size="lg">
                <ApperIcon name="Search" size={20} className="mr-2" />
                Browse Courses
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Filter Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-8"
              >
                <div className="flex space-x-1 bg-surface rounded-lg p-1">
                  {[
                    { key: 'all', label: 'All Courses', count: stats.total },
                    { key: 'in-progress', label: 'In Progress', count: stats.inProgress },
                    { key: 'completed', label: 'Completed', count: stats.completed },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                        filter === tab.key
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Courses Grid */}
              {filteredCourses.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  {filteredCourses.map(({ course, progress, lastAccessed }, index) => (
                    <motion.div
                      key={course.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.05) }}
                      className="bg-white rounded-lg shadow-card p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Course Info */}
                        <div className="flex items-start space-x-4 flex-1">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">
                              {course.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {course.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="User" size={14} />
                                <span>{course.instructor}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Clock" size={14} />
                                <span>Last accessed {lastAccessed.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <ProgressRing 
                              progress={progress.percentComplete} 
                              size={64}
                              color={progress.percentComplete === 100 ? '#51CF66' : '#4C6EF5'}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {progress.completedLessons.length} of 8 lessons
                            </p>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Button
                              as={Link}
                              to={progress.percentComplete === 100 
                                ? `/courses/${course.Id}` 
                                : `/courses/${course.Id}`
                              }
                              size="sm"
                              variant={progress.percentComplete === 100 ? 'accent' : 'primary'}
                            >
                              {progress.percentComplete === 100 ? (
                                <>
                                  <ApperIcon name="Award" size={16} className="mr-1" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <ApperIcon name="Play" size={16} className="mr-1" />
                                  Continue
                                </>
                              )}
                            </Button>
                            
                            <Button
                              as={Link}
                              to={`/courses/${course.Id}`}
                              size="sm"
                              variant="outline"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${
                              progress.percentComplete === 100 ? 'bg-success' : 'bg-primary'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percentComplete}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                /* No results for filter */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <ApperIcon name="Filter" size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-lg text-gray-600 mb-2">
                    No courses in this category
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {filter === 'in-progress' && 'You don\'t have any courses in progress.'}
                    {filter === 'completed' && 'You haven\'t completed any courses yet.'}
                  </p>
                  <Button onClick={() => setFilter('all')} variant="outline">
                    Show All Courses
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default MyLearning