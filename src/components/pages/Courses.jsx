import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import CourseCard from '@/components/molecules/CourseCard'
import SearchBar from '@/components/molecules/SearchBar'
import CategoryTabs from '@/components/molecules/CategoryTabs'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import ApperIcon from '@/components/ApperIcon'
import { courseService, userProgressService } from '@/services'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [userProgress, setUserProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchParams, setSearchParams] = useSearchParams()

  const categories = ['all', 'agriculture', 'health', 'stocks', 'finance']

  useEffect(() => {
    loadCourses()
    loadUserProgress()
    
    // Check URL params
    const category = searchParams.get('category')
    if (category && categories.includes(category)) {
      setActiveCategory(category)
    }
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchQuery, activeCategory])

  const loadCourses = async () => {
    try {
      const coursesData = await courseService.getAll()
      setCourses(coursesData)
    } catch (error) {
      console.error('Failed to load courses:', error)
      toast.error('Failed to load courses')
    }
  }

  const loadUserProgress = async () => {
    try {
      const progressData = await userProgressService.getAll()
      const progressMap = {}
      progressData.forEach(progress => {
        progressMap[progress.courseId] = progress
      })
      setUserProgress(progressMap)
    } catch (error) {
      console.error('Failed to load user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = [...courses]

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(course => course.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
      )
    }

    setFilteredCourses(filtered)
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim() && query !== searchQuery) {
      try {
        const searchResults = await courseService.search(query)
        if (activeCategory === 'all') {
          setFilteredCourses(searchResults)
        }
      } catch (error) {
        console.error('Search failed:', error)
      }
    }
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    
    // Update URL params
    if (category === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', category)
    }
    setSearchParams(searchParams)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-gray-900 mb-4">
              Explore Our Course Catalog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover courses across diverse subjects designed to enhance your skills and knowledge.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for courses, topics, or instructors..."
              className="w-full"
              autoFocus={false}
            />
          </motion.div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              className="max-w-4xl mx-auto"
            />
          </motion.div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="font-display font-semibold text-2xl text-gray-900">
                {activeCategory === 'all' ? 'All Courses' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Courses`}
              </h2>
              <span className="text-gray-500">
                ({filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''})
              </span>
            </div>

            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleSearch('')}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200"
              >
                <span className="text-sm">Clear search</span>
                <ApperIcon name="X" size={14} />
              </motion.button>
            )}
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (index * 0.05) }}
                >
                  <CourseCard
                    course={course}
                    progress={userProgress[course.Id]}
                    showProgress={!!userProgress[course.Id]}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <ApperIcon name="Search" size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-xl text-gray-600 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `No courses match "${searchQuery}". Try a different search term.`
                  : `No courses available in the ${activeCategory} category.`
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Clear search and show all courses
                </button>
              )}
            </motion.div>
          )}

          {/* Course Stats */}
          {filteredCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 bg-surface rounded-2xl p-8"
            >
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold font-display text-primary mb-2">
                    {courses.length}
                  </div>
                  <div className="text-gray-600">Total Courses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-display text-secondary mb-2">
                    {courses.reduce((acc, course) => acc + course.lessons.length, 0)}
                  </div>
                  <div className="text-gray-600">Total Lessons</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-display text-accent mb-2">
                    {Math.round(courses.reduce((acc, course) => acc + course.duration, 0) / 60)}h
                  </div>
                  <div className="text-gray-600">Total Content</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Courses