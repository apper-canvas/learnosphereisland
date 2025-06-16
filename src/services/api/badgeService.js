import badgesData from '@/services/mockData/badges.json'

const delay = () => new Promise(resolve => setTimeout(resolve, 200))

class BadgeService {
  constructor() {
    this.badges = [...badgesData]
  }

  async getAll() {
    await delay()
    return [...this.badges]
  }

  async getById(id) {
    await delay()
    const badge = this.badges.find(b => b.Id === parseInt(id))
    return badge ? { ...badge } : null
  }

  async getEarnedBadges() {
    await delay()
    return this.badges.filter(b => b.earnedDate).map(b => ({ ...b }))
  }

  async checkAndAwardBadges(userProgress) {
    await delay()
    const earnedBadges = []
    
    userProgress.forEach(progress => {
      // Award completion badges
      if (progress.percentComplete === 100) {
        const completionBadge = this.badges.find(b => 
          b.criteria.type === 'course_completion' && 
          b.criteria.courseId === progress.courseId &&
          !b.earnedDate
        )
        
        if (completionBadge) {
          completionBadge.earnedDate = new Date().toISOString()
          earnedBadges.push({ ...completionBadge })
        }
      }
    })

    // Award streak badges based on consecutive learning days
    const streakBadge = this.badges.find(b => 
      b.criteria.type === 'learning_streak' && 
      !b.earnedDate
    )
    
    if (streakBadge && userProgress.length >= 3) {
      streakBadge.earnedDate = new Date().toISOString()
      earnedBadges.push({ ...streakBadge })
    }

    return earnedBadges
  }

  async create(badgeData) {
    await delay()
    const newBadge = {
      ...badgeData,
      Id: Math.max(...this.badges.map(b => b.Id)) + 1
    }
    this.badges.push(newBadge)
    return { ...newBadge }
  }

  async update(id, badgeData) {
    await delay()
    const index = this.badges.findIndex(b => b.Id === parseInt(id))
    if (index === -1) return null
    
    this.badges[index] = { ...this.badges[index], ...badgeData }
    return { ...this.badges[index] }
  }

  async delete(id) {
    await delay()
    const index = this.badges.findIndex(b => b.Id === parseInt(id))
    if (index === -1) return false
    
    this.badges.splice(index, 1)
    return true
  }
}

export default new BadgeService()