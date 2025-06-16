import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const LessonListItem = ({ 
  lesson, 
  courseId, 
  isCompleted = false, 
  isActive = false,
  className = '' 
}) => {
  const getTypeIcon = (type) => {
    const icons = {
      video: 'Play',
      audio: 'Volume2',
      text: 'FileText'
    }
    return icons[type] || 'BookOpen'
  }

  const getTypeColor = (type) => {
    const colors = {
      video: 'text-red-500',
      audio: 'text-purple-500',
      text: 'text-blue-500'
    }
    return colors[type] || 'text-gray-500'
  }

  const formatDuration = (minutes) => {
    return `${minutes}m`
  }

  return (
    <motion.div
      className={`group ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: lesson.order * 0.05 }}
    >
      <Link
        to={`/courses/${courseId}/lessons/${lesson.Id}`}
        className={`flex items-center p-4 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-primary/5 border border-primary/20'
            : isCompleted
            ? 'bg-success/5 hover:bg-success/10'
            : 'bg-white hover:bg-gray-50'
        } ${!isActive && 'border border-gray-100 hover:border-gray-200'}`}
      >
        {/* Completion Status */}
        <div className="flex-shrink-0 mr-3">
          {isCompleted ? (
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={14} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500">
                {lesson.order}
              </span>
            </div>
          )}
        </div>

        {/* Lesson Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium text-sm ${
                isActive ? 'text-primary' : 'text-gray-900'
              } group-hover:text-primary transition-colors duration-200`}>
                {lesson.title}
              </h4>
              
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1">
                  <ApperIcon 
                    name={getTypeIcon(lesson.type)} 
                    size={12} 
                    className={getTypeColor(lesson.type)}
                  />
                  <span className="text-xs text-gray-500 capitalize">
                    {lesson.type}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Clock" size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatDuration(lesson.duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className={`flex-shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              isActive ? 'opacity-100' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <ApperIcon 
                  name={lesson.type === 'video' ? 'Play' : lesson.type === 'audio' ? 'Volume2' : 'Eye'} 
                  size={14} 
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default LessonListItem