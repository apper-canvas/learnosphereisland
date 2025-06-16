import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Badge = ({
  name,
  description,
  icon,
  earnedDate,
  showAnimation = false,
  className = ''
}) => {
  const isEarned = !!earnedDate

  return (
    <motion.div
      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
        isEarned 
          ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-accent shadow-card' 
          : 'bg-gray-50 border-gray-200'
      } ${className}`}
      initial={showAnimation ? { scale: 0, rotate: -180 } : false}
      animate={showAnimation ? { scale: 1, rotate: 0 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        duration: 0.8
      }}
      whileHover={isEarned ? { scale: 1.05 } : {}}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`p-3 rounded-full ${
          isEarned 
            ? 'bg-gradient-to-br from-accent to-primary text-white shadow-lg' 
            : 'bg-gray-200 text-gray-400'
        }`}>
          <ApperIcon name={icon} size={24} />
        </div>
        
        <div>
          <h3 className={`font-display font-semibold text-sm ${
            isEarned ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {name}
          </h3>
          <p className={`text-xs mt-1 ${
            isEarned ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {description}
          </p>
        </div>

        {isEarned && (
          <div className="text-xs text-accent font-medium">
            Earned {new Date(earnedDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {!isEarned && (
        <div className="absolute inset-0 bg-gray-100/50 rounded-lg flex items-center justify-center">
          <ApperIcon name="Lock" size={16} className="text-gray-400" />
        </div>
      )}
    </motion.div>
  )
}

export default Badge