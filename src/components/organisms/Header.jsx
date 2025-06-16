import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import { courseService } from '@/services'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: 'Home' },
    { name: 'Courses', href: '/courses', icon: 'BookOpen' },
    { name: 'My Learning', href: '/my-learning', icon: 'GraduationCap' },
    { name: 'Progress', href: '/progress', icon: 'BarChart3' },
  ]

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    try {
      const results = await courseService.search(query)
      setSearchResults(results)
      setShowSearchResults(true)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const closeSearch = () => {
    setShowSearchResults(false)
    setSearchResults([])
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl">LearnoSphere</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <ApperIcon name={item.icon} size={16} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block relative">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search courses..."
              className="w-80"
            />
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((course) => (
                        <Link
                          key={course.Id}
                          to={`/courses/${course.Id}`}
                          onClick={closeSearch}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover mr-3"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">
                              {course.title}
                            </h4>
                            <p className="text-xs text-gray-500 capitalize">
                              {course.category} • {course.difficulty}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No courses found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
              <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              <div className="pt-2">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search courses..."
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for search results on mobile */}
      {showSearchResults && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={closeSearch}
        />
      )}
    </header>
  )
}

export default Header