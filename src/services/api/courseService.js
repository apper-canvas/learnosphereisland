import coursesData from '@/services/mockData/courses.json'

const delay = () => new Promise(resolve => setTimeout(resolve, 300))

class CourseService {
  constructor() {
    this.courses = [...coursesData]
  }

  async getAll() {
    await delay()
    return [...this.courses]
  }

  async getById(id) {
    await delay()
    const course = this.courses.find(c => c.Id === parseInt(id))
    return course ? { ...course } : null
  }

  async getByCategory(category) {
    await delay()
    return this.courses.filter(c => c.category === category).map(c => ({ ...c }))
  }

  async search(query) {
    await delay()
    const searchTerm = query.toLowerCase()
    return this.courses
      .filter(c => 
        c.title.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm) ||
        c.category.toLowerCase().includes(searchTerm)
      )
      .map(c => ({ ...c }))
  }

  async getRecommended(interests = []) {
    await delay()
    if (interests.length === 0) {
      return this.courses.slice(0, 4).map(c => ({ ...c }))
    }
    
    const recommended = this.courses
      .filter(c => interests.includes(c.category))
      .slice(0, 4)
    
    return recommended.map(c => ({ ...c }))
  }

  async create(courseData) {
    await delay()
    const newCourse = {
      ...courseData,
      Id: Math.max(...this.courses.map(c => c.Id)) + 1
    }
    this.courses.push(newCourse)
    return { ...newCourse }
  }

  async update(id, courseData) {
    await delay()
    const index = this.courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return null
    
    this.courses[index] = { ...this.courses[index], ...courseData }
    return { ...this.courses[index] }
  }

  async delete(id) {
    await delay()
    const index = this.courses.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return false
    
    this.courses.splice(index, 1)
    return true
  }
}

export default new CourseService()