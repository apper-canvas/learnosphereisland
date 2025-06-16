import userProgressData from '@/services/mockData/userProgress.json'

const delay = () => new Promise(resolve => setTimeout(resolve, 250))

class UserProgressService {
  constructor() {
    this.userProgress = [...userProgressData]
  }

  async getAll() {
    await delay()
    return [...this.userProgress]
  }

  async getById(id) {
    await delay()
    const progress = this.userProgress.find(p => p.Id === parseInt(id))
    return progress ? { ...progress } : null
  }

  async getByCourseId(courseId) {
    await delay()
    const progress = this.userProgress.find(p => p.courseId === parseInt(courseId))
    return progress ? { ...progress } : null
  }

  async updateProgress(courseId, lessonId) {
    await delay()
    let progress = this.userProgress.find(p => p.courseId === parseInt(courseId))
    
    if (!progress) {
      progress = {
        Id: Math.max(...this.userProgress.map(p => p.Id)) + 1,
        userId: 'user-1',
        courseId: parseInt(courseId),
        completedLessons: [],
        lastAccessed: new Date().toISOString(),
        percentComplete: 0
      }
      this.userProgress.push(progress)
    }

    if (!progress.completedLessons.includes(parseInt(lessonId))) {
      progress.completedLessons.push(parseInt(lessonId))
      progress.lastAccessed = new Date().toISOString()
      
      // Calculate percentage based on total lessons (assuming 8 lessons per course)
      const totalLessons = 8
      progress.percentComplete = Math.round((progress.completedLessons.length / totalLessons) * 100)
    }

    return { ...progress }
  }

  async enrollInCourse(courseId) {
    await delay()
    const existing = this.userProgress.find(p => p.courseId === parseInt(courseId))
    if (existing) return { ...existing }

    const newProgress = {
      Id: Math.max(...this.userProgress.map(p => p.Id)) + 1,
      userId: 'user-1',
      courseId: parseInt(courseId),
      completedLessons: [],
      lastAccessed: new Date().toISOString(),
      percentComplete: 0
    }
    
    this.userProgress.push(newProgress)
    return { ...newProgress }
  }

  async create(progressData) {
    await delay()
    const newProgress = {
      ...progressData,
      Id: Math.max(...this.userProgress.map(p => p.Id)) + 1
    }
    this.userProgress.push(newProgress)
    return { ...newProgress }
  }

  async update(id, progressData) {
    await delay()
    const index = this.userProgress.findIndex(p => p.Id === parseInt(id))
    if (index === -1) return null
    
    this.userProgress[index] = { ...this.userProgress[index], ...progressData }
    return { ...this.userProgress[index] }
  }

  async delete(id) {
    await delay()
    const index = this.userProgress.findIndex(p => p.Id === parseInt(id))
    if (index === -1) return false
    
    this.userProgress.splice(index, 1)
    return true
  }
}

export default new UserProgressService()