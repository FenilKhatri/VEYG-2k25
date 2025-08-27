const mongoose = require('mongoose')

const gameRegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  gameId: {
    type: String,
    required: true,
    trim: true
  },
  gameName: {
    type: String,
    required: [true, 'Game name is required'],
    trim: true
  },
  registrationType: {
    type: String,
    enum: ['individual', 'team'],
    required: true
  },
  teamName: {
    type: String,
    trim: true
  },
  teamLeader: {
    fullName: String,
    email: String,
    enrollmentNumber: String,
    contactNumber: String,
    collegeName: String,
    semester: String,
    branch: String,
    gender: String,
    degree: String
  },
  teamMembers: [{
    fullName: String,
    email: String,
    enrollmentNumber: String,
    contactNumber: String,
    collegeName: String,
    semester: String,
    branch: String,
    gender: String,
    degree: String
  }],
  teamSize: {
    type: Number,
    default: 1
  },
  gameDay: {
    type: String,
    required: true
  },
  gameCategory: {
    type: String,
    default: 'technical'
  },
  specialRequirements: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: String,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedBy: {
    type: String,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  approverDetails: {
    name: String,
    email: String,
    role: String
  },
  totalFee: {
    type: Number,
    required: true,
    min: 0
  },
  registrationId: {
    type: String,
    unique: true,
    required: true
  },
  receiptNumber: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
})


// Index for faster queries
gameRegistrationSchema.index({ userId: 1 })
gameRegistrationSchema.index({ gameId: 1 })
gameRegistrationSchema.index({ gameName: 1 })
gameRegistrationSchema.index({ gameDay: 1 })
gameRegistrationSchema.index({ approvalStatus: 1 })
gameRegistrationSchema.index({ paymentStatus: 1 })
gameRegistrationSchema.index({ registrationId: 1 }, { unique: true })
gameRegistrationSchema.index({ receiptNumber: 1 }, { unique: true })

// Compound index for day-wise registration validation (one registration per user per day)
gameRegistrationSchema.index({ userId: 1, gameDay: 1 }, { unique: true })

module.exports = mongoose.model('GameRegistration', gameRegistrationSchema)
