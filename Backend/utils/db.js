const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'https://veyg-2k25-backend.onrender.com' ||'mongodb+srv://veygnotification:veyg039@veyg-2k25-db.nznvcbe.mongodb.net/?retryWrites=true&w=majority&appName=VEYG-2k25-DB'

    await mongoose.connect(mongoURI)

    console.log(`MongoDB Connected: ${mongoose.connection.host}`)
    console.log(`Database Name: ${mongoose.connection.name}`)
  } catch (error) {
    console.error('Database connection error:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
