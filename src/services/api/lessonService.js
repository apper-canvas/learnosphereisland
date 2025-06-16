import lessonsData from '@/services/mockData/lessons.json'

const delay = () => new Promise(resolve => setTimeout(resolve, 200))

class LessonService {
  constructor() {
    this.lessons = [...lessonsData]
  }

  async getAll() {
    await delay()
    return [...this.lessons]
  }

  async getById(id) {
    await delay()
    const lesson = this.lessons.find(l => l.Id === parseInt(id))
    return lesson ? { ...lesson } : null
  }

  async getByCourseId(courseId) {
    await delay()
    return this.lessons
      .filter(l => l.courseId === parseInt(courseId))
      .sort((a, b) => a.order - b.order)
      .map(l => ({ ...l }))
  }

  async create(lessonData) {
    await delay()
    const newLesson = {
      ...lessonData,
      Id: Math.max(...this.lessons.map(l => l.Id)) + 1
    }
    this.lessons.push(newLesson)
    return { ...newLesson }
  }

  async update(id, lessonData) {
    await delay()
    const index = this.lessons.findIndex(l => l.Id === parseInt(id))
    if (index === -1) return null
    
    this.lessons[index] = { ...this.lessons[index], ...lessonData }
    return { ...this.lessons[index] }
  }

  async delete(id) {
    await delay()
    const index = this.lessons.findIndex(l => l.Id === parseInt(id))
    if (index === -1) return false
    
    this.lessons.splice(index, 1)
    return true
  }
}

export default new LessonService()