const { exportStudentRegistrations, exportGameRegistrations, exportAllData } = require('../utils/excelExport')
const { successResponse, errorResponse } = require('../utils/response')

// Export student registrations to Excel
const exportStudents = async (req, res) => {
  try {
    const workbook = await exportStudentRegistrations()
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=Student_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.error('Export students error:', error)
    errorResponse(res, 500, 'Failed to export student registrations')
  }
}

// Export game registrations to Excel
const exportGames = async (req, res) => {
  try {
    const workbook = await exportGameRegistrations()
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=Game_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.error('Export game registrations error:', error)
    errorResponse(res, 500, 'Failed to export game registrations')
  }
}

// Export all data to Excel
const exportAllRegistrations = async (req, res) => {
  try {
    const workbook = await exportAllData()
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=VEYG_2K25_All_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.error('Export all registrations error:', error)
    errorResponse(res, 500, 'Failed to export all registrations')
  }
}

module.exports = {
  exportStudents,
  exportGames,
  exportAllRegistrations
}
