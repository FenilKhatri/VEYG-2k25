const { GameRegistration } = require('../models')
const { errorResponse } = require('../utils/response')

// Middleware to validate day-wise registration limits
const validateDayWiseRegistration = async (req, res, next) => {
      try {
            const userId = req.user.id
            const gameDay = parseInt(req.body.gameDay) || 1

            console.log('Day-wise validation - gameDay:', gameDay, 'type:', typeof gameDay, 'original:', req.body.gameDay)

            // Validate gameDay
            if (![1, 2].includes(gameDay)) {
                  return errorResponse(res, 400, `Invalid game day: ${req.body.gameDay}. Only Day 1 and Day 2 are allowed.`)
            }

            // Check if user has already registered for this day
            const existingRegistration = await GameRegistration.findOne({
                  userId,
                  gameDay: `day${gameDay}`
            })

            if (existingRegistration) {
                  return errorResponse(res, 400,
                        `You have already registered for a game on Day ${gameDay}. Only one registration per day is allowed. ` +
                        `You are currently registered for "${existingRegistration.gameName}" (ID: ${existingRegistration.registrationId}).`
                  )
            }

            // Add validated gameDay to request for use in controller
            req.validatedGameDay = gameDay
            next()
      } catch (error) {
            console.error('Day-wise validation error:', error)
            return errorResponse(res, 500, 'Server error during day-wise validation')
      }
}

// Middleware to check if user can register for multiple days
const checkMultiDayRegistration = async (req, res, next) => {
      try {
            const userId = req.user.id

            // Get all user registrations
            const userRegistrations = await GameRegistration.find({ userId })

            // Check if user has reached maximum registrations (2 - one per day)
            if (userRegistrations.length >= 2) {
                  const registrationList = userRegistrations.map(reg =>
                        `${reg.gameName} (${reg.gameDay.toUpperCase()})`
                  ).join(', ')

                  return errorResponse(res, 400,
                        `You have reached the maximum registration limit. You can only register for one game per day (maximum 2 games total). ` +
                        `Your current registrations: ${registrationList}.`
                  )
            }

            next()
      } catch (error) {
            console.error('Multi-day registration check error:', error)
            return errorResponse(res, 500, 'Server error during multi-day registration check')
      }
}

// Get day-wise registration summary for a user
const getDayWiseRegistrationSummary = async (userId) => {
      try {
            const registrations = await GameRegistration.find({ userId })

            const summary = {
                  day1: null,
                  day2: null,
                  totalRegistrations: registrations.length,
                  canRegisterDay1: true,
                  canRegisterDay2: true
            }

            registrations.forEach(reg => {
                  if (reg.gameDay === 'day1') {
                        summary.day1 = {
                              gameName: reg.gameName,
                              registrationId: reg.registrationId,
                              approvalStatus: reg.approvalStatus,
                              paymentStatus: reg.paymentStatus
                        }
                        summary.canRegisterDay1 = false
                  } else if (reg.gameDay === 'day2') {
                        summary.day2 = {
                              gameName: reg.gameName,
                              registrationId: reg.registrationId,
                              approvalStatus: reg.approvalStatus,
                              paymentStatus: reg.paymentStatus
                        }
                        summary.canRegisterDay2 = false
                  }
            })

            return summary
      } catch (error) {
            console.error('Error getting day-wise summary:', error)
            throw error
      }
}

module.exports = {
      validateDayWiseRegistration,
      checkMultiDayRegistration,
      getDayWiseRegistrationSummary
}