const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs').promises;

class AutoExcelStore {
  constructor() {
    this.exportsDir = path.join(__dirname, '../exports');
    this.ensureExportsDir();
  }

  async ensureExportsDir() {
    try {
      await fs.access(this.exportsDir);
    } catch (error) {
      await fs.mkdir(this.exportsDir, { recursive: true });
    }
  }

  async saveStudentRegistration(studentData) {
    try {
      const filePath = path.join(this.exportsDir, 'student_registrations.xlsx');
      let workbook;
      let worksheet;

      try {
        // Try to load existing workbook
        workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        worksheet = workbook.getWorksheet('Student Registrations');
      } catch (error) {
        // Create new workbook if file doesn't exist
        workbook = new ExcelJS.Workbook();
        worksheet = workbook.addWorksheet('Student Registrations');

        // Add headers
        worksheet.columns = [
          { header: 'Registration Date', key: 'registrationDate', width: 20 },
          { header: 'Student ID', key: 'studentId', width: 25 },
          { header: 'Name', key: 'name', width: 25 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Contact Number', key: 'contactNumber', width: 15 },
          { header: 'College Name', key: 'collegeName', width: 30 },
          { header: 'Gender', key: 'gender', width: 10 },
          { header: 'Degree', key: 'degree', width: 15 },
          { header: 'Branch', key: 'branch', width: 20 }
        ];

        // Style headers
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '366092' }
          };
          cell.font = { color: { argb: 'FFFFFF' }, bold: true };
          cell.alignment = { horizontal: 'center' };
        });
      }

      // Add new student data
      const newRow = worksheet.addRow({
        registrationDate: new Date().toLocaleDateString(),
        studentId: studentData._id?.toString() || 'N/A',
        name: studentData.name || 'N/A',
        email: studentData.email || 'N/A',
        contactNumber: studentData.contactNumber || 'N/A',
        collegeName: studentData.collegeName || 'N/A',
        gender: studentData.gender || 'N/A',
        degree: studentData.degree || 'N/A',
        branch: studentData.branch || 'N/A'
      });

      // Style the new row
      newRow.eachCell((cell, colNumber) => {
        if (newRow.number % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F8F9FA' }
          };
        }
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      });

      await workbook.xlsx.writeFile(filePath);
      console.log(`Student registration auto-saved to Excel: ${studentData.name}`);
    } catch (error) {
      console.error('Error auto-saving student registration to Excel:', error);
    }
  }

  async saveGameRegistration(registrationData) {
    try {
      const filePath = path.join(this.exportsDir, 'game_registrations.xlsx');
      let workbook;
      let worksheet;

      try {
        // Try to load existing workbook
        workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        worksheet = workbook.getWorksheet('Game Registrations');
      } catch (error) {
        // Create new workbook if file doesn't exist
        workbook = new ExcelJS.Workbook();
        worksheet = workbook.addWorksheet('Game Registrations');

        // Add headers
        worksheet.columns = [
          { header: 'Registration Date', key: 'registrationDate', width: 20 },
          { header: 'Registration ID', key: 'registrationId', width: 25 },
          { header: 'Game Name', key: 'gameName', width: 25 },
          { header: 'Game Day', key: 'gameDay', width: 12 },
          { header: 'Registration Type', key: 'registrationType', width: 18 },
          { header: 'Team Name', key: 'teamName', width: 25 },
          { header: 'Team Size', key: 'teamSize', width: 12 },
          { header: 'Leader Name', key: 'leaderName', width: 25 },
          { header: 'Leader Email', key: 'leaderEmail', width: 30 },
          { header: 'Leader Contact', key: 'leaderContact', width: 15 },
          { header: 'Leader Gender', key: 'leaderGender', width: 12 },
          { header: 'Leader College', key: 'leaderCollege', width: 30 },
          { header: 'Team Members', key: 'teamMembers', width: 50 },
          { header: 'Total Fee', key: 'totalFee', width: 12 },
          { header: 'Approval Status', key: 'approvalStatus', width: 15 },
          { header: 'Approved By', key: 'approvedBy', width: 20 }
        ];

        // Style headers
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '366092' }
          };
          cell.font = { color: { argb: 'FFFFFF' }, bold: true };
          cell.alignment = { horizontal: 'center' };
        });
      }

      // Format team members details
      let teamMembersDetails = 'N/A';
      if (registrationData.teamMembers && registrationData.teamMembers.length > 0) {
        teamMembersDetails = registrationData.teamMembers.map((member, index) =>
          `Member ${index + 1}: ${member.fullName || 'N/A'} | ${member.email || 'N/A'} | ${member.contactNumber || 'N/A'} | ${member.gender || 'N/A'}`
        ).join(' || ');
      }

      // Add new registration data
      const newRow = worksheet.addRow({
        registrationDate: new Date(registrationData.registrationDate || Date.now()).toLocaleDateString(),
        registrationId: registrationData.registrationId || registrationData.uniqueId || registrationData._id?.toString() || 'N/A',
        gameName: registrationData.gameName || 'N/A',
        gameDay: registrationData.gameDay || 'N/A',
        registrationType: registrationData.registrationType || 'N/A',
        teamName: registrationData.teamName || 'N/A',
        teamSize: registrationData.teamSize || (registrationData.registrationType === 'individual' ? 1 : (1 + (registrationData.teamMembers?.length || 0))),
        leaderName: registrationData.teamLeader?.fullName || 'N/A',
        leaderEmail: registrationData.teamLeader?.email || 'N/A',
        leaderContact: registrationData.teamLeader?.contactNumber || 'N/A',
        leaderGender: registrationData.teamLeader?.gender || 'N/A',
        leaderCollege: registrationData.teamLeader?.collegeName || 'N/A',
        teamMembers: teamMembersDetails,
        totalFee: registrationData.totalFee || 0,
        approvalStatus: registrationData.approvalStatus || 'pending',
        approvedBy: registrationData.approvedBy || 'N/A'
      });

      // Style the new row
      newRow.eachCell((cell, colNumber) => {
        if (newRow.number % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F8F9FA' }
          };
        }
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      });

      await workbook.xlsx.writeFile(filePath);
      console.log(`Game registration auto-saved to Excel: ${registrationData.gameName} - ${registrationData.teamLeader?.fullName}`);
    } catch (error) {
      console.error('Error auto-saving game registration to Excel:', error);
    }
  }

  async saveCombinedRegistration(studentData, gameRegistrationData) {
    try {
      const filePath = path.join(this.exportsDir, 'all_registrations.xlsx');
      let workbook;
      let worksheet;

      try {
        // Try to load existing workbook
        workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        worksheet = workbook.getWorksheet('All Registrations');
      } catch (error) {
        // Create new workbook if file doesn't exist
        workbook = new ExcelJS.Workbook();
        worksheet = workbook.addWorksheet('All Registrations');

        // Add headers
        worksheet.columns = [
          { header: 'Date', key: 'date', width: 20 },
          { header: 'Type', key: 'type', width: 15 },
          { header: 'Student Name', key: 'studentName', width: 25 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Contact', key: 'contact', width: 15 },
          { header: 'College', key: 'college', width: 30 },
          { header: 'Game Name', key: 'gameName', width: 25 },
          { header: 'Team Name', key: 'teamName', width: 25 },
          { header: 'Registration Type', key: 'registrationType', width: 18 },
          { header: 'Total Fee', key: 'totalFee', width: 12 },
          { header: 'Payment Status', key: 'paymentStatus', width: 15 }
        ];

        // Style headers
        worksheet.getRow(1).eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '366092' }
          };
          cell.font = { color: { argb: 'FFFFFF' }, bold: true };
          cell.alignment = { horizontal: 'center' };
        });
      }

      // Add new combined data
      const newRow = worksheet.addRow({
        date: new Date().toLocaleDateString(),
        type: gameRegistrationData ? 'Game Registration' : 'Student Registration',
        studentName: studentData?.name || gameRegistrationData?.teamLeader?.fullName || 'N/A',
        email: studentData?.email || gameRegistrationData?.teamLeader?.email || 'N/A',
        contact: studentData?.contactNumber || gameRegistrationData?.teamLeader?.contactNumber || 'N/A',
        college: studentData?.collegeName || gameRegistrationData?.teamLeader?.collegeName || 'N/A',
        gameName: gameRegistrationData?.gameName || 'N/A',
        teamName: gameRegistrationData?.teamName || 'N/A',
        registrationType: gameRegistrationData?.registrationType || 'N/A',
        totalFee: gameRegistrationData?.totalFee || 0,
        paymentStatus: gameRegistrationData?.paymentStatus || 'N/A'
      });

      // Style the new row
      newRow.eachCell((cell, colNumber) => {
        if (newRow.number % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F8F9FA' }
          };
        }
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      });

      await workbook.xlsx.writeFile(filePath);
      console.log(`Combined registration auto-saved to Excel`);
    } catch (error) {
      console.error('Error auto-saving combined registration to Excel:', error);
    }
  }
}

module.exports = new AutoExcelStore();
