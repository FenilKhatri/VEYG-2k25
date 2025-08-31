"use client"
import React from "react"
import { Modal, Button } from "react-bootstrap"
import {
  Download,
  Trophy,
  User,
  Mail,
  Phone,
  Building2,
  Users,
  Calendar,
  IndianRupee,
  CheckCircle,
  FileText,
  Award,
  MapPin,
  Globe,
} from "lucide-react"

export default function VEYGReceipt({ show, onHide, game }) {
  const handleDownloadPDF = () => {
    try {
      if (typeof window === 'undefined') {
        console.error("Window object not available")
        return
      }

      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("Please allow popups to download the receipt.")
        return
      }

      const receiptContent = document.getElementById("veyg-receipt-content")
      if (!receiptContent) {
        console.error("Receipt content not found")
        alert("Receipt content not found. Please try again.")
        return
      }

      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>VEYG 2K25 - Official Payment Receipt</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif; 
              background: #f8fafc;
              color: #1e293b;
              line-height: 1.6;
            }
            .page {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto 20px;
              background: white;
              border: 2px solid #e2e8f0;
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              page-break-after: always;
              overflow: hidden;
            }
            .page:last-child {
              page-break-after: avoid;
            }
            .tech-header {
              background: linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%);
              color: white;
              padding: 1.5rem;
              position: relative;
              overflow: hidden;
            }
            .tech-header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 10h20M10 0v20M5 5h10v10H5z" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none"/></pattern></defs><rect width="100" height="100" fill="url(%23circuit)"/></svg>');
              opacity: 0.3;
            }
            .header-content {
              position: relative;
              z-index: 1;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .logo-container {
              width: 80px;
              height: 80px;
              background: rgba(255,255,255,0.15);
              border-radius: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255,255,255,0.2);
              overflow: hidden;
            }
            .logo-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
              border-radius: 12px;
            }
            .logo-placeholder {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              font-size: 0.7rem;
              font-weight: 500;
              opacity: 0.9;
            }
            .center-title {
              text-align: center;
              flex: 1;
              margin: 0 2rem;
            }
            .institute-name {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 0.25rem;
            }
            .location {
              font-size: 0.9rem;
              opacity: 0.9;
              margin-bottom: 0.5rem;
            }
            .receipt-title {
              font-size: 1rem;
              font-weight: 500;
              opacity: 0.8;
            }
            .page-body {
              flex: 1;
              padding: 2rem;
            }
            .tech-footer {
              background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
              color: white;
              padding: 1rem 2rem;
              text-align: center;
              font-size: 0.875rem;
            }
            .event-title {
              font-size: 3rem;
              font-weight: 800;
              text-align: center;
              background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin: 2rem 0;
            }
            .event-date {
              font-size: 1.5rem;
              font-weight: 600;
              text-align: center;
              color: #059669;
              margin-bottom: 2rem;
            }
            .info-card {
              background: #f8fafc;
              border-radius: 12px;
              padding: 1.5rem;
              margin-bottom: 1.5rem;
              border: 1px solid #e2e8f0;
            }
            .section-title {
              font-size: 1.25rem;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 1rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1rem;
            }
            .info-item {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.75rem;
              background: white;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .info-icon {
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              flex-shrink: 0;
            }
            .info-label {
              font-size: 0.875rem;
              color: #64748b;
              font-weight: 500;
            }
            .info-value {
              font-size: 1rem;
              color: #1e293b;
              font-weight: 600;
            }
            .member-card {
              background: white;
              border-radius: 8px;
              padding: 1rem;
              border: 1px solid #e2e8f0;
              margin-bottom: 0.75rem;
            }
            .member-header {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              margin-bottom: 0.75rem;
            }
            .member-number {
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 600;
              font-size: 0.875rem;
            }
            .thank-you-page {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 3rem 2rem;
            }
            .thank-you-title {
              font-size: 2.5rem;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 1.5rem;
            }
            .thank-you-content {
              font-size: 1.1rem;
              color: #64748b;
              line-height: 1.8;
              max-width: 600px;
            }
            .contact-info {
              background: #f0f9ff;
              border-radius: 12px;
              padding: 1.5rem;
              margin: 2rem 0;
              border: 1px solid #bae6fd;
            }
            .tech-team {
              background: #fef3c7;
              border-radius: 12px;
              padding: 1.5rem;
              margin-top: 2rem;
              border: 1px solid #fde68a;
            }
            @media print {
              body { background: white; }
              .page { 
                margin: 0; 
                border: none; 
                border-radius: 0;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          ${receiptContent.innerHTML}
        </body>
        </html>
      `

      printWindow.document.write(printHTML)
      printWindow.document.close()

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Failed to download receipt. Please try again.")
    }
  }

  if (!game) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-4">
            <FileText size={48} className="text-muted mb-3" />
            <h3 className="h5 fw-semibold mb-2">No Registration Data Available</h3>
            <p className="text-muted">Please select a valid game registration to view receipt.</p>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  const receiptNumber = game.registrationDetails?.registrationId || `VEYG-${Date.now().toString().slice(-8)}`
  const isApproved = game.approvalStatus === "approved" || game.registrationDetails?.paymentStatus === "confirmed"

  // Safe data extraction with fallbacks
  const gameName = game.name || game.gameName || "N/A"
  const registrationFee = game.registrationFee || game.totalFee || "0"
  const registrationType = game.registrationDetails?.registrationType || "Individual"

  const teamMembers = Array.isArray(game.registrationDetails?.teamMembers)
    ? game.registrationDetails.teamMembers
    : []
  const membersPerPage = 4 // Maximum members per page to avoid splitting
  const memberPages = []

  if (teamMembers.length > 0) {
    for (let i = 0; i < teamMembers.length; i += membersPerPage) {
      memberPages.push(teamMembers.slice(i, i + membersPerPage))
    }
  }

  const Header = () => (
    <div className="tech-header">
      <div className="header-content">
        {/* Left Logo - College Logo */}
        <div className="logo-container">
          {/* Replace with actual college logo image */}
          <img
            src="https://drive.google.com/uc?export=download&id=14yJp4RCwuTyS7oF81wDYz3P7astSb9CT"
            alt="College Logo"
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="logo-placeholder" style={{ display: 'none' }}>
            <Building2 size={24} />
            <span>College Logo</span>
          </div>
        </div>

        {/* Center Title */}
        <div className="center-title">
          <div className="institute-name">Saffrony Institute of Technology</div>
          <div className="location">
            <MapPin size={16} style={{ display: "inline", marginRight: "0.25rem" }} />
            Location: Linch, Mehsana
          </div>
          <div className="receipt-title">Official Payment Receipt</div>
        </div>

        {/* Right Logo - Web/Event Logo */}
        <div className="logo-container">
          {/* Replace with actual web/event logo image */}
          <img
            src="https://drive.google.com/uc?export=view&id=1wkvCexRdse26PEwdy_RnlCmbL4t2q4Sq"
            alt="VEYG Logo"
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="logo-placeholder" style={{ display: 'none' }}>
            <Globe size={24} />
            <span>VEYG Logo</span>
          </div>
        </div>
      </div>
    </div>
  )

  const Footer = () => (
    <div className="tech-footer">
      <div>
        <strong>Technical Team:</strong> Fenil Khatri, Divyesh Khubavat, Vraj Fadiya, Riddhi Sadhu
      </div>
      <div style={{ marginTop: "0.5rem" }}>
        <strong>Contact:</strong> veyg.notification@gmail.com
      </div>
    </div>
  )

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
          color: "white",
          border: "none",
        }}
      >
        <Modal.Title className="d-flex align-items-center gap-2">
          <FileText size={24} />
          VEYG 2K25 - Official Payment Receipt
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto", padding: 0 }}>
        <div id="veyg-receipt-content">
          {/* Page 1: Event Title, Date, and Registration Information */}
          <div className="page">
            <Header />

            <div className="page-body">
              <div className="event-title">VEYG-2K25</div>
              <div className="event-date">
                <Calendar size={20} style={{ display: "inline", marginRight: "0.5rem" }} />
                Date: 15-16 Sept
              </div>

              <div className="info-card">
                <div className="section-title">
                  <Award size={20} />
                  Registration Information
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <div className="info-label">Game Name</div>
                      <div className="info-value">{gameName}</div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="info-label">Registration ID</div>
                      <div className="info-value">{receiptNumber}</div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <Users size={16} />
                    </div>
                    <div>
                      <div className="info-label">Registration Type</div>
                      <div className="info-value">{registrationType}</div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <IndianRupee size={16} />
                    </div>
                    <div>
                      <div className="info-label">Registration Fee</div>
                      <div className="info-value" style={{ color: "#059669", fontSize: "1.25rem", fontWeight: "700" }}>
                        ₹{registrationFee}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "50px",
                      fontWeight: "600",
                      background: isApproved ? "#dcfce7" : "#fef3c7",
                      color: isApproved ? "#166534" : "#92400e",
                      border: `1px solid ${isApproved ? "#bbf7d0" : "#fde68a"}`,
                    }}
                  >
                    <CheckCircle size={16} />
                    {isApproved ? "Payment Confirmed" : "Payment Pending"}
                  </span>
                </div>
              </div>
            </div>

            <Footer />
          </div>

          {/* Page 2: Team Details and Team Leader (if team registration) */}
          {registrationType.toLowerCase() === "team" && (
            <>
              <div className="page">
                <Header />

                <div className="page-body">
                  {/* Team Leader Details */}
                  <div className="info-card">
                    <div className="section-title">
                      <User size={20} />
                      Team Leader Details
                    </div>

                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-icon">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="info-label">Full Name</div>
                          <div className="info-value">{game.registrationDetails?.teamLeader?.fullName || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon">
                          <Mail size={16} />
                        </div>
                        <div>
                          <div className="info-label">Email Address</div>
                          <div className="info-value">{game.registrationDetails?.teamLeader?.email || "N/A"}</div>
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon">
                          <Phone size={16} />
                        </div>
                        <div>
                          <div className="info-label">Contact Number</div>
                          <div className="info-value">
                            {game.registrationDetails?.teamLeader?.contactNumber || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div className="info-label">College Name</div>
                          <div className="info-value">{game.registrationDetails?.teamLeader?.collegeName || "N/A"}</div>
                        </div>
                      </div>
                    </div>

                    {game.registrationDetails?.teamName && (
                      <div style={{ marginTop: "1rem" }}>
                        <div className="info-item">
                          <div className="info-icon">
                            <Users size={16} />
                          </div>
                          <div>
                            <div className="info-label">Team Name</div>
                            <div className="info-value">{game.registrationDetails.teamName}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Individual Participant Details */}
                  {registrationType.toLowerCase() === "individual" && (
                    <div className="info-card">
                      <div className="section-title">
                        <User size={20} />
                        Participant Details
                      </div>

                      <div className="info-grid">
                        <div className="info-item">
                          <div className="info-icon">
                            <FileText size={16} />
                          </div>
                          <div>
                            <div className="info-label">Enrollment Number</div>
                            <div className="info-value">{game.registrationDetails?.teamLeader?.enrollmentNumber || "N/A"}</div>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <User size={16} />
                          </div>
                          <div>
                            <div className="info-label">Gender</div>
                            <div className="info-value">{game.registrationDetails?.teamLeader?.gender || "N/A"}</div>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <Calendar size={16} />
                          </div>
                          <div>
                            <div className="info-label">Semester</div>
                            <div className="info-value">{game.registrationDetails?.teamLeader?.semester || "N/A"}</div>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <Award size={16} />
                          </div>
                          <div>
                            <div className="info-label">Branch</div>
                            <div className="info-value">{game.registrationDetails?.teamLeader?.branch || "N/A"}</div>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <Trophy size={16} />
                          </div>
                          <div>
                            <div className="info-label">Degree</div>
                            <div className="info-value">{game.registrationDetails?.teamLeader?.degree || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* First batch of team members */}
                  {memberPages.length > 0 && (
                    <div className="info-card">
                      <div className="section-title">
                        <Users size={20} />
                        Team Members ({teamMembers.length} total)
                      </div>

                      {memberPages[0].map((member, index) => {
                        const memberName = typeof member === 'string' ? member : (member.fullName || member.name || `Member ${index + 1}`)
                        const isObjectMember = typeof member === 'object' && member !== null

                        return (
                          <div key={index} className="member-card">
                            <div className="member-header">
                              <div className="member-number">{index + 1}</div>
                              <div style={{ fontWeight: "600", color: "#1e293b" }}>{memberName}</div>
                            </div>
                            {isObjectMember && (member.email || member.contactNumber || member.collegeName) && (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                  gap: "0.5rem",
                                  fontSize: "0.875rem",
                                  color: "#64748b",
                                }}
                              >
                                {member.email && <div>📧 {member.email}</div>}
                                {member.contactNumber && <div>📱 {member.contactNumber}</div>}
                                {member.collegeName && <div>🏫 {member.collegeName}</div>}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <Footer />
              </div>

              {/* Additional pages for remaining team members */}
              {memberPages.slice(1).map((memberBatch, pageIndex) => (
                <div key={pageIndex + 1} className="page">
                  <Header />

                  <div className="page-body">
                    <div className="info-card">
                      <div className="section-title">
                        <Users size={20} />
                        Team Members (continued)
                      </div>

                      {memberBatch.map((member, index) => {
                        const memberName = typeof member === 'string' ? member : (member.fullName || member.name || `Member ${(pageIndex + 1) * membersPerPage + index + 1}`)
                        const isObjectMember = typeof member === 'object' && member !== null

                        return (
                          <div key={index} className="member-card">
                            <div className="member-header">
                              <div className="member-number">{(pageIndex + 1) * membersPerPage + index + 1}</div>
                              <div style={{ fontWeight: "600", color: "#1e293b" }}>{memberName}</div>
                            </div>
                            {isObjectMember && (member.email || member.contactNumber || member.collegeName) && (
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                  gap: "0.5rem",
                                  fontSize: "0.875rem",
                                  color: "#64748b",
                                }}
                              >
                                {member.email && <div>📧 {member.email}</div>}
                                {member.contactNumber && <div>📱 {member.contactNumber}</div>}
                                {member.collegeName && <div>🏫 {member.collegeName}</div>}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Footer />
                </div>
              ))}
            </>
          )}

          {/* Page 3: Thank You Message */}
          <div className="page">
            <Header />

            <div className="page-body">
              <div className="thank-you-page">
                <div className="thank-you-title">🎉 Thank You for Registering! 🎉</div>

                <div className="thank-you-content">
                  <p style={{ marginBottom: "1.5rem" }}>
                    This is an official payment receipt for VEYG 2K25. Please keep this receipt for your records.
                  </p>

                  <div className="contact-info">
                    <h4 style={{ color: "#1e40af", marginBottom: "1rem" }}>Contact Information</h4>
                    <p style={{ marginBottom: "0.5rem" }}>
                      <strong>Email:</strong> veyg.notification@gmail.com
                    </p>
                    <p style={{ marginBottom: "0.5rem" }}>
                      <strong>Institute:</strong> Saffrony Institute of Technology
                    </p>
                    <p style={{ marginBottom: "0" }}>
                      <strong>Location:</strong> Linch, Mehsana
                    </p>
                  </div>

                  <div className="tech-team">
                    <h4 style={{ color: "#92400e", marginBottom: "1rem" }}>Technical Team</h4>
                    <p style={{ marginBottom: "0" }}>Fenil Khatri, Divyesh Khubavat, Vraj Fadiya, Riddhi Sadhu</p>
                  </div>

                  <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#64748b" }}>
                    For any queries or support, please don't hesitate to reach out to us.
                  </p>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: "#f8f9fa", border: "none" }}>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleDownloadPDF}
          style={{
            background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
            border: "none",
          }}
        >
          <Download size={16} className="me-2" />
          Download Receipt
        </Button>
      </Modal.Footer>
    </Modal>
  )
}