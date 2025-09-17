const { GameRegistration } = require('../models')

/**
 * Validate if a user can register for a specific day
 * @param {string} userId - User ID
 * @param {number} gameDay - Day number (1 or 2)
 * @returns {Promise<{canRegister: boolean, reason?: string, existingRegistration?: object}>}
 */
const validateDayRegistration = async (userId, gameDay) => {
      try {
            // Check if gameDay is valid
            if (![1, 2].includes(gameDay)) {
                  return {
                        canRegister: false,
                        reason: 'Invalid game day. Only Day 1 and Day 2 are allowed.'
                  }
            }

            // Check if user already registered for this day
            const existingRegistration = await GameRegistration.findOne({
                  userId,
                  gameDay: `day${gameDay}`
            })

            if (existingRegistration) {
                  return {
                        canRegister: false,
                        reason: `Already registered for Day ${gameDay}`,
                        existingRegistration: {
                              gameName: existingRegistration.gameName,
                              registrationId: existingRegistration.registrationId,
                              registrationDate: existingRegistration.createdAt
                        }
                  }
            }

            return {
                  canRegister: true
            }
      } catch (error) {
            return {
                  canRegister: false,
                  reason: 'Server error during validation'
            }
      }
}

/**
 * Get user's registration summary across all days
 * @param {string} userId - User ID
 * @returns {Promise<object>} Registration summary
 */
const getUserRegistrationSummary = async (userId) => {
      try {
            const registrations = await GameRegistration.find({ userId })
                  .select('gameName gameDay registrationId approvalStatus paymentStatus createdAt')
                  .sort({ createdAt: -1 })

            const summary = {
                  totalRegistrations: registrations.length,
                  maxAllowed: 2,
                  day1: null,
                  day2: null,
                  canRegisterDay1: true,
                  canRegisterDay2: true,
                  canRegisterMore: true
            }

            registrations.forEach(reg => {
                  if (reg.gameDay === 'day1') {
                        summary.day1 = reg
                        summary.canRegisterDay1 = false
                  } else if (reg.gameDay === 'day2') {
                        summary.day2 = reg
                        summary.canRegisterDay2 = false
                  }
            })

            summary.canRegisterMore = summary.canRegisterDay1 || summary.canRegisterDay2

            return summary
      } catch (error) {
            throw error
      }
}

/**
 * Check if user has reached maximum registration limit
 * @param {string} userId - User ID
 * @returns {Promise<{hasReachedLimit: boolean, registrationCount: number}>}
 */
const checkRegistrationLimit = async (userId) => {
      try {
            const registrationCount = await GameRegistration.countDocuments({ userId })
            const maxRegistrations = 2 // One per day

            return {
                  hasReachedLimit: registrationCount >= maxRegistrations,
                  registrationCount,
                  maxRegistrations
            }
      } catch (error) {
            throw error
      }
}

/**
 * Get day-wise registration statistics
 * @returns {Promise<object>} Day-wise statistics
 */
const getDayWiseStatistics = async () => {
      try {
            const stats = await GameRegistration.aggregate([
                  {
                        $group: {
                              _id: '$gameDay',
                              totalRegistrations: { $sum: 1 },
                              totalFees: { $sum: '$totalFee' },
                              approvedCount: {
                                    $sum: { $cond: [{ $eq: ['$approvalStatus', 'approved'] }, 1, 0] }
                              },
                              pendingCount: {
                                    $sum: { $cond: [{ $eq: ['$approvalStatus', 'pending'] }, 1, 0] }
                              },
                              rejectedCount: {
                                    $sum: { $cond: [{ $eq: ['$approvalStatus', 'rejected'] }, 1, 0] }
                              },
                              paidCount: {
                                    $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] }
                              },
                              games: { $addToSet: '$gameName' }
                        }
                  },
                  {
                        $sort: { _id: 1 }
                  }
            ])

            const result = {
                  day1: {
                        totalRegistrations: 0,
                        totalFees: 0,
                        approvedCount: 0,
                        pendingCount: 0,
                        rejectedCount: 0,
                        paidCount: 0,
                        games: []
                  },
                  day2: {
                        totalRegistrations: 0,
                        totalFees: 0,
                        approvedCount: 0,
                        pendingCount: 0,
                        rejectedCount: 0,
                        paidCount: 0,
                        games: []
                  }
            }

            stats.forEach(stat => {
                  if (stat._id === 'day1') {
                        result.day1 = { ...stat, games: stat.games }
                        delete result.day1._id
                  } else if (stat._id === 'day2') {
                        result.day2 = { ...stat, games: stat.games }
                        delete result.day2._id
                  }
            })

            // Calculate totals
            result.overall = {
                  totalRegistrations: result.day1.totalRegistrations + result.day2.totalRegistrations,
                  totalFees: result.day1.totalFees + result.day2.totalFees,
                  totalApproved: result.day1.approvedCount + result.day2.approvedCount,
                  totalPending: result.day1.pendingCount + result.day2.pendingCount,
                  totalRejected: result.day1.rejectedCount + result.day2.rejectedCount,
                  totalPaid: result.day1.paidCount + result.day2.paidCount,
                  uniqueGames: [...new Set([...result.day1.games, ...result.day2.games])]
            }

            return result
      } catch (error) {
            throw error
      }
}

module.exports = {
      validateDayRegistration,
      getUserRegistrationSummary,
      checkRegistrationLimit,
      getDayWiseStatistics
}