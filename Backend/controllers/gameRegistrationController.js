const { successResponse, errorResponse } = require('../utils/responseHandler')
const { sendRegistrationConfirmationEmail, sendPaymentConfirmationEmail } = require('../sendMail')
const GameRegistration = require('../models/GameRegistration')
const Student = require('../models/Student')
const dayWiseValidation = require('../middleware/dayWiseValidation')
const sheetsService = require('../services/googleSheets')

// Generate unique registration ID and receipt number
const generateRegistrationId = async (teamLeaderName, collegeName, gameName, gameDay, registrationType, teamMembers = []) => {
  try {
    // College code mapping - unique 3-letter codes for each college
    const collegeCodeMap = {
      'saffrony institute of technology': 'SAF',
      'saffrony': 'SAF',
      'l.d. college of engineering': 'LDC',
      'ld college': 'LDC',
      'charotar university of science and technology': 'CUS',
      'charusat': 'CUS',
      'gujarat technological university': 'GTU',
      'nirma university': 'NIR',
      'da-iict': 'DAI',
      'iit gandhinagar': 'IIG',
      'nit surat': 'NIS',
      'pdpu': 'PDP',
      'ganpat university': 'GAU',
      'marwadi university': 'MAR',
      'silver oak university': 'SOK',
      'parul university': 'PAR',
      'uka tarsadia university': 'UKA',
      'rk university': 'RKU',
      'atmiya university': 'ATM',
      'bhagwan mahavir university': 'BMU'
    }

    // Game code mapping - unique 3-letter codes for each game
    const gameCodeMap = {
      'cpu assembly': 'CPU',
      'algo cricket': 'ACR',
      'braingo': 'BGO',
      'logo2logic': 'L2L',
      'code debugging': 'CDB',
      'web designing': 'WEB',
      'treasure hunt': 'TRH',
      'quiz competition': 'QUZ',
      'coding contest': 'COD',
      'hackathon': 'HAK'
    }

    // Get college code (default to first 3 letters if not found)
    const normalizedCollege = collegeName.toLowerCase().trim()
    let collegeCode = collegeCodeMap[normalizedCollege]

    if (!collegeCode) {
      // Generate code from college name if not in mapping
      const words = normalizedCollege.split(' ').filter(word => word.length > 0)
      if (words.length >= 2) {
        collegeCode = (words[0].charAt(0) + words[1].charAt(0) + words[0].charAt(1)).toUpperCase()
      } else {
        collegeCode = normalizedCollege.substring(0, 3).toUpperCase()
      }
    }

    // Get game code (default to first 3 letters if not found)
    const normalizedGame = gameName.toLowerCase().trim()
    let gameCode = gameCodeMap[normalizedGame]

    if (!gameCode) {
      // Generate code from game name if not in mapping
      const words = normalizedGame.split(' ').filter(word => word.length > 0)
      if (words.length >= 2) {
        gameCode = (words[0].charAt(0) + words[1].charAt(0) + words[0].charAt(1)).toUpperCase()
      } else {
        gameCode = normalizedGame.substring(0, 3).toUpperCase()
      }
    }

    // Get team number (count of teams for this college and game combination)
    const existingTeams = await GameRegistration.countDocuments({
      gameName: gameName,
      'teamLeader.collegeName': { $regex: new RegExp(collegeName, 'i') }
    })
    const teamNumber = existingTeams + 1

    // For individual registration, return single ID
    if (registrationType === 'individual') {
      const registrationId = `${collegeCode}-${gameCode}-${gameDay}-1 [${teamLeaderName}]`

      // Check if this ID already exists
      const existingId = await GameRegistration.findOne({ registrationId })
      if (existingId) {
        const randomSuffix = Math.floor(Math.random() * 100)
        return `${collegeCode}-${gameCode}-${gameDay}-1-${randomSuffix} [${teamLeaderName}]`
      }

      return registrationId
    }

    // For team registration, generate IDs for all members
    const teamIds = []

    // Team leader ID (member 1)
    const leaderIdBase = `${collegeCode}-${gameCode}-${gameDay}-${teamNumber}-1`
    let leaderId = `${leaderIdBase} [${teamLeaderName}]`

    // Check if leader ID exists
    const existingLeaderId = await GameRegistration.findOne({ registrationId: leaderId })
    if (existingLeaderId) {
      const randomSuffix = Math.floor(Math.random() * 100)
      leaderId = `${leaderIdBase}-${randomSuffix} [${teamLeaderName}]`
    }

    teamIds.push({
      memberId: leaderId,
      memberName: teamLeaderName,
      memberType: 'leader'
    })

    // Team members IDs (member 2, 3, 4, etc.)
    teamMembers.forEach((member, index) => {
      const memberNumber = index + 2 // Start from 2 (leader is 1)
      const memberName = member.fullName || member.name || `Member ${memberNumber}`
      const memberIdBase = `${collegeCode}-${gameCode}-${gameDay}-${teamNumber}-${memberNumber}`
      const memberId = `${memberIdBase} [${memberName}]`

      teamIds.push({
        memberId: memberId,
        memberName: memberName,
        memberType: 'member'
      })
    })

    return {
      teamRegistrationId: leaderId, // Main registration ID (team leader)
      teamIds: teamIds // All member IDs
    }

  } catch (error) {
    console.error('Error generating registration ID:', error)
    // Fallback ID generation
    const timestamp = Date.now()
    const fallbackCode = collegeName.substring(0, 3).toUpperCase()
    return `${fallbackCode}-GEN-${timestamp} [${teamLeaderName}]`
  }
}

// Generate receipt number based on total registrations
const generateReceiptNumber = async () => {
  try {
    const totalRegistrations = await GameRegistration.countDocuments()
    return `VEYG-${totalRegistrations + 1}`
  } catch (error) {
    console.error('Error generating receipt number:', error)
    return `VEYG-${Date.now()}`
  }
}

// Register for a game
const registerGame = async (req, res) => {
  try {
    console.log('=== GAME REGISTRATION REQUEST ===')
    console.log('User:', req.user)
    console.log('Request body:', req.body)
    console.log('Validated gameDay from middleware:', req.validatedGameDay)

    const {
      registrationType,
      gameId,
      gameName,
      teamName,
      teamLeader,
      teamMembers,
      totalAmount,
      specialRequirements
    } = req.body

    // Validate required fields
    if (!gameId || !gameName || !registrationType) {
      return errorResponse(res, 400, 'Missing required fields: gameId, gameName, and registrationType are required')
    }

    if (registrationType === 'team' && !teamLeader) {
      return errorResponse(res, 400, 'Team leader information is required for team registration')
    }
    const userId = req.user.id

    // Validate user exists
    const { Student } = require('../models')
    const user = await Student.findById(userId)
    if (!user) {
      return errorResponse(res, 404, 'User not found')
    }

    // Check if user already registered for this game
    const existingRegistration = await GameRegistration.findOne({ userId, gameId })
    if (existingRegistration) {
      return errorResponse(res, 400, 'You have already registered for this game')
    }

    // Use validated gameDay from middleware (fallback to request body)
    const gameDay = req.validatedGameDay || req.body.gameDay || 1

    // Calculate team size and total fee
    const teamSize = registrationType === 'team' ? (teamMembers ? teamMembers.length + 1 : 1) : 1
    const totalFee = totalAmount || 500 // Use provided amount or default

    // Generate unique registration ID and receipt number
    const teamLeaderName = teamLeader?.fullName || 'Unknown'
    const collegeName = teamLeader?.collegeName || 'Unknown College'
    const registrationIdResult = await generateRegistrationId(teamLeaderName, collegeName, gameName, gameDay, registrationType, teamMembers)

    // Handle different return types (string for individual, object for team)
    const registrationId = typeof registrationIdResult === 'string' ? registrationIdResult : registrationIdResult.teamRegistrationId
    const teamIds = typeof registrationIdResult === 'object' ? registrationIdResult.teamIds : null

    const receiptNumber = await generateReceiptNumber()

    const registration = new GameRegistration({
      userId,
      gameId,
      gameName,
      registrationType,
      teamName,
      teamLeader,
      teamMembers,
      teamSize,
      totalFee,
      gameDay: `day${gameDay}`,
      gameCategory: 'technical', // Default category
      specialRequirements,
      registrationId,
      receiptNumber
    })

    console.log('Creating registration with userId:', userId)
    console.log('Registration data to save:', {
      userId,
      gameId,
      gameName,
      registrationType,
      teamName,
      teamLeader,
      teamMembers: teamMembers ? teamMembers.length : 0,
      teamSize,
      totalFee,
      gameDay: `day${gameDay}`,
      registrationId,
      receiptNumber
    })

    await registration.save()
    console.log('Registration saved successfully with ID:', registration._id)

    // Skip PDF generation for registration emails - only generate for payment confirmation

    // Send registration confirmation email using the stored PDF
    try {
      console.log('📧 Sending registration confirmation email with stored PDF...');
      
      await sendRegistrationConfirmationEmail(registration);
      
      console.log('✅ Registration confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send registration confirmation email:', emailError);
      // Don't fail the registration process if email fails
    }

    // Append registration data to Google Sheet (non-blocking)
    try {
      console.log('📊 Attempting to sync registration to Google Sheet...');
      
      const sheetResult = await sheetsService.addRegistration(registration);
      
      // Update registration with sheet sync status
      registration.sheetSync = {
        success: sheetResult.success,
        error: sheetResult.success ? null : sheetResult.error,
        lastAttempt: new Date(),
        rowNumber: sheetResult.rowNumber || null
      };
      
      await registration.save();
      
      if (sheetResult.success) {
        console.log('✅ Registration synced to Google Sheet successfully');
      } else {
        console.error('❌ Failed to sync registration to Google Sheet:', sheetResult.error);
      }
    } catch (sheetError) {
      console.error('❌ Google Sheet sync error:', sheetError);
      
      // Update registration with error status
      try {
        registration.sheetSync = {
          success: false,
          error: sheetError.message,
          lastAttempt: new Date(),
          rowNumber: null
        };
        await registration.save();
      } catch (saveError) {
        console.error('❌ Failed to save sheet sync error status:', saveError);
      }
    }

    console.log('✅ Game registration completed successfully')

    // Populate user data for response
    await registration.populate('userId', 'name email contactNumber')

    successResponse(res, 201, 'Game registration successful', { registration })
  } catch (error) {
    console.error('Game registration error:', error)

    // Handle specific error types
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message)
      return errorResponse(res, 400, 'Validation error', validationErrors)
    }

    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0]
      return errorResponse(res, 400, `Duplicate ${field}. This registration already exists.`)
    }

    // Log the full error for debugging
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    })

    errorResponse(res, 500, 'Server error during game registration')
  }
}

// Get user's registered games
const getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    console.log('Fetching registrations for user ID:', userId)
    console.log('User object:', req.user)

    const registrations = await GameRegistration.find({ userId })
      .populate('userId', 'name email contactNumber')
      .sort({ createdAt: -1 })

    console.log(`Found ${registrations.length} registrations for user ${userId}`)

    // Return registrations in the expected format
    successResponse(res, 200, 'Registrations retrieved successfully', {
      registrations,
      count: registrations.length
    })
  } catch (error) {
    console.error('Get registrations error:', error)
    errorResponse(res, 500, 'Server error while fetching registrations')
  }
}

// Get all registrations (Admin only)
const getAllRegistrations = async (req, res) => {
  try {
    const { status, game, search } = req.query
    let filter = {}

    // Apply filters
    if (status && status !== 'all') {
      if (status === 'paid' || status === 'pending') {
        filter.paymentStatus = status
      } else if (status === 'approved' || status === 'rejected') {
        filter.approvalStatus = status
      }
    }

    if (game && game !== 'all') {
      filter.gameName = game
    }

    let registrations = await GameRegistration.find(filter)
      .populate('userId', 'name email contactNumber')
      .sort({ createdAt: -1 })

    // Apply search filter
    if (search) {
      registrations = registrations.filter(reg =>
        reg.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        reg.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        reg.gameName?.toLowerCase().includes(search.toLowerCase()) ||
        reg.teamName?.toLowerCase().includes(search.toLowerCase())
      )
    }

    successResponse(res, 200, 'All registrations retrieved successfully', { registrations })
  } catch (error) {
    console.error('Get all registrations error:', error)
    errorResponse(res, 500, 'Server error while fetching all registrations')
  }
}

// Update registration status (Admin only)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { paymentStatus, approvalStatus } = req.body

    const updateData = {}
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (approvalStatus) {
      updateData.approvalStatus = approvalStatus
      // Add approver information when approving
      if (approvalStatus === 'approved') {
        updateData.approvedBy = req.user.name || req.user.email || 'Admin'
        updateData.approvedAt = new Date()
        updateData.approverDetails = {
          name: req.user.name || 'Admin',
          email: req.user.email || 'admin@veyg.com',
          role: req.user.role || 'admin'
        }
        // Clear rejected fields if previously rejected
        updateData.rejectedBy = null
        updateData.rejectedAt = null
      } else if (approvalStatus === 'rejected') {
        updateData.rejectedBy = req.user.name || req.user.email || 'Admin'
        updateData.rejectedAt = new Date()
        updateData.approverDetails = {
          name: req.user.name || 'Admin',
          email: req.user.email || 'admin@veyg.com',
          role: req.user.role || 'admin'
        }
        // Clear approved fields if previously approved
        updateData.approvedBy = null
        updateData.approvedAt = null
      }
    }

    const registration = await GameRegistration.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email contactNumber')

    if (!registration) {
      return errorResponse(res, 404, 'Registration not found')
    }

    // Send payment confirmation email when payment is approved
    if (paymentStatus === 'paid' && approvalStatus === 'approved') {
      try {
        console.log('📧 Sending payment confirmation email for approved registration...');
        
        await sendPaymentConfirmationEmail(registration);
        
        console.log('✅ Payment confirmation email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send payment confirmation email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    successResponse(res, 200, 'Registration status updated successfully', { registration })
  } catch (error) {
    console.error('Update registration status error:', error)
    errorResponse(res, 500, 'Server error while updating registration status')
  }
}

// Get user's day-wise registration status
const getDayWiseRegistrationStatus = async (req, res) => {
  try {
    const userId = req.user.id

    // Get registrations for both days
    const registrations = await GameRegistration.find({ userId })
      .populate('userId', 'name email contactNumber')
      .sort({ createdAt: -1 })

    // Organize by day
    const dayWiseStatus = {
      day1: {
        registered: false,
        registration: null,
        availableSlots: 1
      },
      day2: {
        registered: false,
        registration: null,
        availableSlots: 1
      }
    }

    registrations.forEach(reg => {
      if (reg.gameDay === 'day1') {
        dayWiseStatus.day1.registered = true
        dayWiseStatus.day1.registration = reg
        dayWiseStatus.day1.availableSlots = 0
      } else if (reg.gameDay === 'day2') {
        dayWiseStatus.day2.registered = true
        dayWiseStatus.day2.registration = reg
        dayWiseStatus.day2.availableSlots = 0
      }
    })

    successResponse(res, 200, 'Day-wise registration status retrieved successfully', {
      dayWiseStatus,
      totalRegistrations: registrations.length,
      maxRegistrationsPerDay: 1
    })
  } catch (error) {
    console.error('Get day-wise status error:', error)
    errorResponse(res, 500, 'Server error while fetching day-wise registration status')
  }
}

// Check if user can register for a specific day
const checkDayAvailability = async (req, res) => {
  try {
    const { day } = req.params
    const userId = req.user.id

    if (![1, 2].includes(parseInt(day))) {
      return errorResponse(res, 400, 'Invalid day. Only Day 1 and Day 2 are supported.')
    }

    const existingRegistration = await GameRegistration.findOne({
      userId,
      gameDay: `day${day}`
    })

    const isAvailable = !existingRegistration
    const response = {
      day: parseInt(day),
      available: isAvailable,
      message: isAvailable
        ? `You can register for Day ${day}`
        : `You have already registered for Day ${day}`,
      existingRegistration: existingRegistration ? {
        gameName: existingRegistration.gameName,
        registrationId: existingRegistration.registrationId,
        registrationDate: existingRegistration.createdAt
      } : null
    }

    successResponse(res, 200, 'Day availability checked successfully', response)
  } catch (error) {
    console.error('Check day availability error:', error)
    errorResponse(res, 500, 'Server error while checking day availability')
  }
}

// Get day-wise registration statistics (Admin only)
const getDayWiseStats = async (req, res) => {
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
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    // Format the response
    const formattedStats = {
      day1: stats.find(s => s._id === 'day1') || {
        totalRegistrations: 0,
        totalFees: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        paidCount: 0
      },
      day2: stats.find(s => s._id === 'day2') || {
        totalRegistrations: 0,
        totalFees: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        paidCount: 0
      }
    }

    // Remove _id field from results
    delete formattedStats.day1._id
    delete formattedStats.day2._id

    // Add overall totals
    const overallStats = {
      totalRegistrations: formattedStats.day1.totalRegistrations + formattedStats.day2.totalRegistrations,
      totalFees: formattedStats.day1.totalFees + formattedStats.day2.totalFees,
      totalApproved: formattedStats.day1.approvedCount + formattedStats.day2.approvedCount,
      totalPending: formattedStats.day1.pendingCount + formattedStats.day2.pendingCount,
      totalRejected: formattedStats.day1.rejectedCount + formattedStats.day2.rejectedCount,
      totalPaid: formattedStats.day1.paidCount + formattedStats.day2.paidCount
    }

    successResponse(res, 200, 'Day-wise statistics retrieved successfully', {
      dayWiseStats: formattedStats,
      overallStats
    })
  } catch (error) {
    console.error('Get day-wise stats error:', error)
    errorResponse(res, 500, 'Server error while fetching day-wise statistics')
  }
}

// Delete registration
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const isAdmin = req.user.role === 'admin'

    let filter = { _id: id }
    if (!isAdmin) {
      filter.userId = userId // Students can only delete their own registrations
    }

    const registration = await GameRegistration.findOneAndDelete(filter)

    if (!registration) {
      return errorResponse(res, 404, 'Registration not found or unauthorized')
    }

    successResponse(res, 200, 'Registration deleted successfully', {
      deletedRegistration: {
        gameName: registration.gameName,
        gameDay: registration.gameDay,
        registrationId: registration.registrationId
      }
    })
  } catch (error) {
    console.error('Delete registration error:', error)
    errorResponse(res, 500, 'Server error while deleting registration')
  }
}

module.exports = {
  registerGame,
  getUserRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  getDayWiseRegistrationStatus,
  checkDayAvailability,
  getDayWiseStats
}