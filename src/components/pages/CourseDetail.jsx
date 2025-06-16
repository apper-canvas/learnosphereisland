import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ProgressRing from '@/components/atoms/ProgressRing'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import LessonListItem from '@/components/molecules/LessonListItem'
import { courseService, lessonService, userProgressService } from '@/services'

const CourseDetail = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    loadCourseData()
  }, [courseId])

  const loadCourseData = async () => {
    try {
      setLoading(true)

      // Load course details
      const courseData = await courseService.getById(courseId)
      if (!courseData) {
        toast.error('Course not found')
        return
      }
      setCourse(courseData)

      // Load lessons
      const lessonsData = await lessonService.getByCourseId(courseId)
      setLessons(lessonsData)

      // Load user progress
      const progressData = await userProgressService.getByCourseId(courseId)
      setUserProgress(progressData)

    } catch (error) {
      console.error('Failed to load course data:', error)
      toast.error('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      setEnrolling(true)
      const progress = await userProgressService.enrollInCourse(courseId)
      setUserProgress(progress)
      toast.success('Successfully enrolled in course!')
    } catch (error) {
      console.error('Failed to enroll:', error)
      toast.error('Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      agriculture: 'bg-categories-agriculture',
      health: 'bg-categories-health',
      stocks: 'bg-categories-stocks',
      finance: 'bg-categories-finance'
    }
    return colors[category] || 'bg-gray-500'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      agriculture: 'Sprout',
      health: 'Heart',
      stocks: 'TrendingUp',
      finance: 'DollarSign'
    }
    return icons[category] || 'BookOpen'
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl text-gray-600 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button as={Link} to="/courses">
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  const isEnrolled = !!userProgress
  const completedLessons = userProgress?.completedLessons || []
  const nextLesson = lessons.find(lesson => !completedLessons.includes(lesson.Id))

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-80 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              {/* Breadcrumb */}
              <nav className="mb-4">
                <Link 
                  to="/courses" 
                  className="text-white/80 hover:text-white transition-colors duration-200 flex items-center space-x-1"
                >
                  <ApperIcon name="ArrowLeft" size={16} />
                  <span>Back to Courses</span>
                </Link>
              </nav>

              {/* Category Badge */}
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-white text-sm font-medium mb-4 ${getCategoryColor(course.category)}`}>
                <ApperIcon name={getCategoryIcon(course.category)} size={14} />
                <span className="capitalize">{course.category}</span>
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-4xl lg:text-5xl mb-4">
                {course.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="User" size={16} />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={16} />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="BarChart3" size={16} />
                  <span>{course.difficulty}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="BookOpen" size={16} />
                  <span>{lessons.length} Lessons</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Course Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
                  About This Course
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {course.description}
                </p>
              </motion.div>

              {/* What You'll Learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
                  What You'll Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Master fundamental concepts and principles',
                    'Apply practical skills in real-world scenarios',
                    'Gain confidence through hands-on practice',
                    'Access to comprehensive learning materials',
                    'Learn at your own pace with flexible scheduling',
                    'Earn certificates upon successful completion'
                  ].map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ApperIcon name="Check" size={14} className="text-success" />
                      </div>
                      <span className="text-gray-600">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Course Curriculum */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
                  Course Curriculum
                </h2>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <LessonListItem
                      key={lesson.Id}
                      lesson={lesson}
                      courseId={courseId}
                      isCompleted={completedLessons.includes(lesson.Id)}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-24"
              >
                {/* Enrollment Card */}
                <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                  {isEnrolled ? (
                    <div className="text-center mb-6">
                      <ProgressRing 
                        progress={userProgress.percentComplete} 
                        size={80}
                        color="#4C6EF5"
                        className="mb-4"
                      />
                      <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                        {userProgress.percentComplete}% Complete
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {completedLessons.length} of {lessons.length} lessons completed
                      </p>
                    </div>
                  ) : (
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <ApperIcon name={getCategoryIcon(course.category)} size={32} className="text-white" />
                      </div>
                      <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                        Ready to Start Learning?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Enroll now to begin your learning journey
                      </p>
                    </div>
                  )}

                  {isEnrolled ? (
                    <div className="space-y-3">
                      {nextLesson ? (
                        <Button 
                          as={Link}
                          to={`/courses/${courseId}/lessons/${nextLesson.Id}`}
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <ApperIcon name="Play" size={16} />
                          <span>Continue Learning</span>
                        </Button>
                      ) : (
                        <Button 
                          as={Link}
                          to={`/courses/${courseId}/lessons/${lessons[0]?.Id}`}
                          variant="accent"
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <ApperIcon name="Award" size={16} />
                          <span>Course Complete!</span>
                        </Button>
                      )}
                      
                      <Button 
                        as={Link}
                        to="/my-learning"
                        variant="outline"
                        className="w-full"
                      >
                        View My Learning
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      {enrolling ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <ApperIcon name="BookOpen" size={16} />
                          <span>Enroll for Free</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Course Features */}
                <div className="bg-surface rounded-lg p-6">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                    Course Features
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: 'Clock', label: 'Self-paced learning' },
                      { icon: 'Smartphone', label: 'Mobile friendly' },
                      { icon: 'Download', label: 'Downloadable resources' },
                      { icon: 'Award', label: 'Certificate of completion' },
                      { icon: 'Users', label: 'Community support' },
                      { icon: 'Infinity', label: 'Lifetime access' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <ApperIcon name={feature.icon} size={16} className="text-primary" />
                        <span className="text-gray-600 text-sm">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CourseDetail