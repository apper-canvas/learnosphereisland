import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import ProgressRing from '@/components/atoms/ProgressRing'

const CourseCard = ({ 
  course, 
  progress = null, 
  className = '',
  showProgress = true 
}) => {
  const categoryColors = {
    agriculture: 'bg-categories-agriculture',
    health: 'bg-categories-health',
    stocks: 'bg-categories-stocks',
    finance: 'bg-categories-finance'
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

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/courses/${course.Id}`} className="block">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-medium ${categoryColors[course.category]}`}>
            <div className="flex items-center space-x-1">
              <ApperIcon name={getCategoryIcon(course.category)} size={12} />
              <span className="capitalize">{course.category}</span>
            </div>
          </div>
          
          {showProgress && progress && (
            <div className="absolute top-3 right-3">
              <ProgressRing 
                progress={progress.percentComplete} 
                size={40} 
                strokeWidth={3}
                color="#12B886"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-2 flex-1">
              {course.title}
            </h3>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" size={14} />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="BarChart3" size={14} />
                <span>{course.difficulty}</span>
              </div>
            </div>
            
            {showProgress && progress && (
              <div className="text-accent font-medium">
                {progress.percentComplete}% Complete
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={12} className="text-primary" />
              </div>
              <span className="text-sm text-gray-600">{course.instructor}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CourseCard