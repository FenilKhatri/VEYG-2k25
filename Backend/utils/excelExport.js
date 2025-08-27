const ExcelJS = require('exceljs');
const { Student, GameRegistration, Admin } = require('../models');

// Export student registrations to Excel
const exportStudentRegistrations = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student Registrations');

    // Define columns - only required fields
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Contact Number', key: 'contactNumber', width: 20 },
      { header: 'College Name', key: 'collegeName', width: 40 },
      { header: 'Gender', key: 'gender', width: 15 },
      { header: 'Password', key: 'password', width: 20 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Is Admin', key: 'isAdmin', width: 15 }
    ];

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '366092' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Fetch student data
    const students = await Student.find({}).sort({ _id: -1 });

    // Add data rows
    students.forEach((student, index) => {
      const row = worksheet.addRow({
        name: student.name,
        email: student.email,
        contactNumber: student.contactNumber,
        collegeName: student.collegeName || 'N/A',
        gender: student.gender || 'N/A',
        password: '***HIDDEN***',
        role: student.role || 'student',
        isAdmin: student.isAdmin || false
      });

      // Style data rows
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle' };
      });

      // Alternate row colors
      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F8F9FA' }
          };
        });
      }
    });

    return workbook;
  } catch (error) {
    console.error('Error exporting student registrations:', error);
    throw error;
  }
};

// Export admin data to Excel
const exportAdminData = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Admin Data');

    // Define columns
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Contact Number', key: 'contactNumber', width: 20 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Password', key: 'password', width: 20 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Is Admin', key: 'isAdmin', width: 15 }
    ];

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'DC3545' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Fetch admin data
    const admins = await Admin.find({}).sort({ _id: -1 });

    // Add data rows
    admins.forEach((admin, index) => {
      const row = worksheet.addRow({
        name: admin.name,
        contactNumber: admin.contactNumber,
        email: admin.email,
        password: '***HIDDEN***',
        role: admin.role || 'admin',
        isAdmin: admin.isAdmin || true
      });

      // Style data rows
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle' };
      });

      // Alternate row colors
      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F8F9FA' }
          };
        });
      }
    });

    return workbook;
  } catch (error) {
    console.error('Error exporting admin data:', error);
    throw error;
  }
};

// Export game registrations to Excel
const exportGameRegistrations = async () => {
  try {
    console.log('Starting game registrations export...');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Game Registrations');

    // Define columns
    worksheet.columns = [
      { header: 'Game ID Name', key: 'gameIdName', width: 25 },
      { header: 'Registration Type', key: 'registrationType', width: 20 },
      { header: 'Team Name', key: 'teamName', width: 25 },
      { header: 'Team Leader', key: 'teamLeader', width: 50 },
      { header: 'Game Day', key: 'gameDay', width: 15 },
      { header: 'Approval Status', key: 'approvalStatus', width: 15 },
      { header: 'Approval By', key: 'approvalBy', width: 20 },
      { header: 'Total Fee', key: 'totalFee', width: 12 },
      { header: 'Registration ID', key: 'registrationId', width: 25 },
      { header: 'Receipt Number', key: 'receiptNumber', width: 25 }
    ];

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '28A745' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Fetch game registration data
    console.log('Fetching game registrations...');
    const registrations = await GameRegistration.find({})
      .sort({ _id: -1 });

    console.log(`Found ${registrations.length} registrations`);

    // Add data rows
    registrations.forEach((registration, index) => {
      // Format team leader details
      let teamLeaderDetails = 'N/A';
      if (registration.teamLeader) {
        const leader = registration.teamLeader;
        teamLeaderDetails = `${leader.fullName || 'N/A'} | ${leader.email || 'N/A'} | ${leader.contactNumber || 'N/A'} | ${leader.collegeName || 'N/A'} | ${leader.gender || 'N/A'}`;
      }

      const row = worksheet.addRow({
        gameIdName: registration.gameIdName || 'N/A',
        registrationType: registration.registrationType,
        teamName: registration.teamName || 'N/A',
        leaderName: registration.teamLeader?.fullName || registration.userId?.name || 'N/A',
        leaderEmail: registration.teamLeader?.email || registration.userId?.email || 'N/A',
        leaderContact: registration.teamLeader?.contactNumber || 'N/A',
        leaderGender: registration.teamLeader?.gender || registration.userId?.gender || 'N/A',
        leaderCollege: registration.teamLeader?.collegeName || registration.userId?.collegeName || 'N/A',
        teamMembers: teamMembersDetails,
        totalFee: `₹${registration.totalFee}`,
        approvalStatus: registration.approvalStatus,
        approvedBy: registration.approvedBy || 'N/A',
        createdAt: registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'
      });

      // Style data rows
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle' };
      });

      // Alternate row colors
      if (index % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F8F9FA' }
          };
        });
      }
    });

    return workbook;
  } catch (error) {
    console.error('Error exporting game registrations:', error);
    throw error;
  }
};

// Export combined data to Excel with multiple sheets
const exportAllData = async () => {
  try {
    console.log('Starting export all data...');
    const workbook = new ExcelJS.Workbook();

    // Add metadata
    workbook.creator = 'VEYG 2K25 Admin Panel';
    workbook.lastModifiedBy = 'VEYG System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Create student registrations sheet directly
    console.log('Creating student sheet...');
    const studentSheet = workbook.addWorksheet('Student Registrations');

    // Define student columns
    studentSheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Contact Number', key: 'contactNumber', width: 20 },
      { header: 'College Name', key: 'collegeName', width: 40 },
      { header: 'Gender', key: 'gender', width: 15 }
    ];

    // Fetch and add student data
    const students = await Student.find({}).sort({ _id: -1 });
    students.forEach((student) => {
      studentSheet.addRow({
        name: student.name,
        email: student.email,
        contactNumber: student.contactNumber,
        collegeName: student.collegeName || 'N/A',
        gender: student.gender || 'N/A'
      });
    });

    // Create game registrations sheet directly
    console.log('Creating game registrations sheet...');
    const gameSheet = workbook.addWorksheet('Game Registrations');

    // Define game registration columns
    gameSheet.columns = [
      { header: 'Registration ID', key: 'id', width: 25 },
      { header: 'Game Name', key: 'gameName', width: 25 },
      { header: 'Registration Type', key: 'registrationType', width: 20 },
      { header: 'Team Name', key: 'teamName', width: 25 },
      { header: 'Leader Name', key: 'leaderName', width: 25 },
      { header: 'Leader Email', key: 'leaderEmail', width: 30 },
      { header: 'Total Fee', key: 'totalFee', width: 12 },
      { header: 'Approval Status', key: 'approvalStatus', width: 15 },
      { header: 'Registration Date', key: 'createdAt', width: 20 }
    ];

    // Fetch and add game registration data
    const registrations = await GameRegistration.find({})
      .populate('userId', 'name email contactNumber')
      .sort({ _id: -1 });

    registrations.forEach((registration) => {
      gameSheet.addRow({
        id: registration.registrationId || registration._id.toString(),
        gameName: registration.gameName,
        registrationType: registration.registrationType,
        teamName: registration.teamName || 'N/A',
        leaderName: registration.teamLeader?.fullName || registration.userId?.name || 'N/A',
        leaderEmail: registration.teamLeader?.email || registration.userId?.email || 'N/A',
        totalFee: `₹${registration.totalFee}`,
        approvalStatus: registration.approvalStatus,
        createdAt: registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'
      });
    });

    console.log('Export all data completed successfully');
    return workbook;
  } catch (error) {
    console.error('Error exporting all data:', error);
    throw error;
  }
};

module.exports = {
  exportStudentRegistrations,
  exportGameRegistrations,
  exportAllData
};
