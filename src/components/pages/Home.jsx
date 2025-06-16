import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import CourseCard from '@/components/molecules/CourseCard'
import Badge from '@/components/atoms/Badge'
import ProgressRing from '@/components/atoms/ProgressRing'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { courseService, userProgressService, badgeService } from '@/services'

const Home = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [recentProgress, setRecentProgress] = useState([])
  const [earnedBadges, setEarnedBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    earnedBadges: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user progress
      const progressData = await userProgressService.getAll()
      setRecentProgress(progressData)

      // Load enrolled courses with progress
      const enrolledCoursesData = []
      for (const progress of progressData) {
        const course = await courseService.getById(progress.courseId)
        if (course) {
          enrolledCoursesData.push({ course, progress })
        }
      }
      setEnrolledCourses(enrolledCoursesData)

      // Load recommended courses (sample interests)
      const interests = ['agriculture', 'health', 'finance', 'stocks']
      const recommended = await courseService.getRecommended(interests)
      setRecommendedCourses(recommended)

      // Load earned badges
      const badges = await badgeService.getEarnedBadges()
      setEarnedBadges(badges)

      // Calculate stats
      const completedCourses = progressData.filter(p => p.percentComplete === 100).length
      const totalHours = enrolledCoursesData.reduce((acc, { course }) => acc + course.duration, 0)
      
      setStats({
        totalCourses: enrolledCoursesData.length,
        completedCourses,
        totalHours: Math.round(totalHours / 60),
        earnedBadges: badges.length
      })

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Check if user needs onboarding
  if (enrolledCourses.length === 0 && recentProgress.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4 max-w-2xl mx-auto"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-8">
            <ApperIcon name="GraduationCap" size={40} className="text-white" />
          </div>
          
          <h1 className="font-display font-bold text-4xl text-gray-900 mb-4">
            Welcome to LearnoSphere
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive learning hub for diverse skills and knowledge. 
            Let's personalize your learning experience.
          </p>
          
          <Button 
            as={Link} 
            to="/onboarding" 
            size="lg"
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name="ArrowRight" size={20} />
            <span>Get Started</span>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-gray-900 mb-4">
              Welcome back to your
              <span className="text-primary"> learning journey</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Continue where you left off and discover new courses tailored to your interests.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Enrolled Courses', value: stats.totalCourses, icon: 'BookOpen', color: 'text-primary' },
              { label: 'Completed', value: stats.completedCourses, icon: 'CheckCircle', color: 'text-success' },
              { label: 'Learning Hours', value: stats.totalHours, icon: 'Clock', color: 'text-secondary' },
              { label: 'Badges Earned', value: stats.earnedBadges, icon: 'Award', color: 'text-accent' },
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Continue Learning */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-2xl text-gray-900">
                  Continue Learning
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

              {enrolledCourses.length > 0 ? (
                <div className="grid gap-6">
                  {enrolledCourses.slice(0, 3).map(({ course, progress }) => (
                    <motion.div
                      key={course.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg p-6 shadow-card"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {progress.completedLessons.length} of 8 lessons completed
                          </p>
                        </div>
                        <ProgressRing 
                          progress={progress.percentComplete} 
                          size={60}
                          color="#4C6EF5"
                        />
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <motion.div
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress.percentComplete}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Last accessed {new Date(progress.lastAccessed).toLocaleDateString()}
                        </span>
                        <Button 
                          as={Link} 
                          to={`/courses/${course.Id}`}
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <span>Continue</span>
                          <ApperIcon name="ArrowRight" size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="BookOpen" size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-lg text-gray-600 mb-2">
                    No courses enrolled yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Explore our course catalog to start learning
                  </p>
                  <Button as={Link} to="/courses">
                    Browse Courses
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Recent Badges */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg text-gray-900">
                    Recent Achievements
                  </h3>
                  <Button 
                    as={Link} 
                    to="/progress" 
                    variant="ghost" 
                    size="sm"
                    className="text-xs"
                  >
                    View All
                  </Button>
                </div>
                
                {earnedBadges.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="Award" size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      Complete lessons to earn badges
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    as={Link} 
                    to="/courses" 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <ApperIcon name="Search" size={16} className="mr-2" />
                    Explore Courses
                  </Button>
                  <Button 
                    as={Link} 
                    to="/progress" 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <ApperIcon name="BarChart3" size={16} className="mr-2" />
                    View Progress
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Courses */}
          {recommendedCourses.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-2xl text-gray-900">
                  Recommended for You
                </h2>
                <Button 
                  as={Link} 
                  to="/courses" 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ApperIcon name="ArrowRight" size={16} />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedCourses.map((course, index) => (
                  <motion.div
                    key={course.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CourseCard 
                      course={course} 
                      showProgress={false}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home