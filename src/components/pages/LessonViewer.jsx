import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import LessonListItem from '@/components/molecules/LessonListItem'
import { courseService, lessonService, userProgressService } from '@/services'

const LessonViewer = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [lessons, setLessons] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [markingComplete, setMarkingComplete] = useState(false)

  useEffect(() => {
    loadLessonData()
  }, [courseId, lessonId])

  const loadLessonData = async () => {
    try {
      setLoading(true)

      // Load course, lesson, and lessons list
      const [courseData, lessonData, lessonsData, progressData] = await Promise.all([
        courseService.getById(courseId),
        lessonService.getById(lessonId),
        lessonService.getByCourseId(courseId),
        userProgressService.getByCourseId(courseId)
      ])

      if (!courseData || !lessonData) {
        toast.error('Lesson not found')
        navigate('/courses')
        return
      }

      setCourse(courseData)
      setCurrentLesson(lessonData)
      setLessons(lessonsData)
      setUserProgress(progressData)

    } catch (error) {
      console.error('Failed to load lesson data:', error)
      toast.error('Failed to load lesson')
      navigate('/courses')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!userProgress) {
      toast.error('Please enroll in the course first')
      return
    }

    try {
      setMarkingComplete(true)
      const updatedProgress = await userProgressService.updateProgress(courseId, lessonId)
      setUserProgress(updatedProgress)
      toast.success('Lesson marked as complete!')
    } catch (error) {
      console.error('Failed to mark lesson complete:', error)
      toast.error('Failed to update progress')
    } finally {
      setMarkingComplete(false)
    }
  }

  const getNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.Id === parseInt(lessonId))
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  }

  const getPreviousLesson = () => {
    const currentIndex = lessons.findIndex(l => l.Id === parseInt(lessonId))
    return currentIndex > 0 ? lessons[currentIndex - 1] : null
  }

  const renderLessonContent = () => {
    if (!currentLesson) return null

    const { type, content } = currentLesson

    switch (type) {
      case 'video':
        return (
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
            <iframe
              src={content.videoUrl}
              title={currentLesson.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )

      case 'audio':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 mb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Volume2" size={32} className="text-white" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                Audio Lesson
              </h3>
              <p className="text-gray-600">
                Audio player would be integrated here in a real application
              </p>
            </div>

            {content.transcript && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Transcript</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {content.transcript}
                </p>
              </div>
            )}
          </div>
        )

      case 'text':
        return (
          <div className="prose prose-lg max-w-none mb-6">
            {content.images && content.images.length > 0 && (
              <div className="mb-6">
                <img
                  src={content.images[0]}
                  alt="Lesson content"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {content.text}
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <ApperIcon name="FileQuestion" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Content format not supported</p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl text-gray-600 mb-2">
            Lesson Not Found
          </h2>
          <Button as={Link} to="/courses">
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  const nextLesson = getNextLesson()
  const previousLesson = getPreviousLesson()
  const isCompleted = userProgress?.completedLessons?.includes(parseInt(lessonId)) || false

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white rounded-lg shadow-card"
      >
        <ApperIcon name="Menu" size={20} />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Mobile Backdrop */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-30"
              />
            )}

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed lg:relative lg:translate-x-0 left-0 top-0 h-full w-80 bg-white border-r border-gray-100 z-40 flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <Link
                    to={`/courses/${courseId}`}
                    className="text-primary hover:text-primary/80 flex items-center space-x-2"
                  >
                    <ApperIcon name="ArrowLeft" size={16} />
                    <span className="font-medium">Back to Course</span>
                  </Link>
                  
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <h2 className="font-display font-semibold text-lg text-gray-900 line-clamp-2">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {userProgress ? `${userProgress.completedLessons.length} of ${lessons.length} complete` : 'Not enrolled'}
                </p>
              </div>

              {/* Lessons List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {lessons.map((lesson) => (
                  <LessonListItem
                    key={lesson.Id}
                    lesson={lesson}
                    courseId={courseId}
                    isCompleted={userProgress?.completedLessons?.includes(lesson.Id) || false}
                    isActive={lesson.Id === parseInt(lessonId)}
                  />
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Lesson Header */}
        <header className="bg-white border-b border-gray-100 p-6">
          <div className="max-w-4xl">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <ApperIcon 
                      name={currentLesson.type === 'video' ? 'Play' : currentLesson.type === 'audio' ? 'Volume2' : 'FileText'} 
                      size={14} 
                    />
                    <span className="capitalize">{currentLesson.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={14} />
                    <span>{currentLesson.duration}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Hash" size={14} />
                    <span>Lesson {currentLesson.order}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isCompleted ? (
                  <div className="flex items-center space-x-2 text-success">
                    <ApperIcon name="CheckCircle" size={20} />
                    <span className="font-medium">Complete</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={markingComplete}
                    size="sm"
                    variant="outline"
                  >
                    {markingComplete ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <ApperIcon name="Check" size={16} className="mr-1" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Lesson Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderLessonContent()}

            {/* Key Points */}
            {currentLesson.content.keyPoints && (
              <div className="bg-surface rounded-lg p-6 mb-6">
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {currentLesson.content.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ApperIcon name="CheckCircle" size={14} className="text-primary" />
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <footer className="bg-white border-t border-gray-100 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              {previousLesson ? (
                <Button
                  as={Link}
                  to={`/courses/${courseId}/lessons/${previousLesson.Id}`}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                  <span>Previous</span>
                </Button>
              ) : (
                <div />
              )}
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-500">
                Lesson {currentLesson.order} of {lessons.length}
              </span>
            </div>

            <div>
              {nextLesson ? (
                <Button
                  as={Link}
                  to={`/courses/${courseId}/lessons/${nextLesson.Id}`}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              ) : (
                <Button
                  as={Link}
                  to={`/courses/${courseId}`}
                  variant="accent"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Award" size={16} />
                  <span>Course Complete</span>
                </Button>
              )}
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default LessonViewer