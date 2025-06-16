import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryTabs = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  className = '' 
}) => {
  const categoryConfig = {
    all: { icon: 'Grid3X3', label: 'All Courses', color: 'text-gray-600' },
    agriculture: { icon: 'Sprout', label: 'Agriculture', color: 'text-categories-agriculture' },
    health: { icon: 'Heart', label: 'Health', color: 'text-categories-health' },
    stocks: { icon: 'TrendingUp', label: 'Stocks', color: 'text-categories-stocks' },
    finance: { icon: 'DollarSign', label: 'Finance', color: 'text-categories-finance' }
  }

  return (
    <div className={`flex space-x-1 bg-surface rounded-lg p-1 ${className}`}>
      {categories.map((category) => {
        const config = categoryConfig[category]
        const isActive = category === activeCategory

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon 
              name={config.icon} 
              size={16} 
              className={isActive ? 'text-primary' : config.color}
            />
            <span>{config.label}</span>
            
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-white rounded-md shadow-sm"
                layoutId="activeTab"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export default CategoryTabs