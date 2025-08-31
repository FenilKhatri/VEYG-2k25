"use client"

import { useState, useEffect } from "react"
import { Modal, Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap"
import { Users, Phone, Mail, Hash, User, Building2, PlusCircle, MinusCircle, CreditCard, Trophy, Zap, UserPlus, Trash2, AlertTriangle } from "lucide-react"
import { collegesInGujarat, semesters, branches, genders, degrees } from "../data/constant"
import apiService from "../services/api"

const RegistrationForm = ({ show, handleClose, game, userId, onRegisterGame, showToast, registeredGames, isRegistrationExpired = false }) => {
  const initialParticipantState = {
    fullName: "",
    email: "",
    enrollmentNumber: "",
    contactNumber: "",
    collegeName: "",
    semester: "",
    branch: "",
    gender: "",
    degree: "",
  }

  const [registrationType, setRegistrationType] = useState("individual")
  const [teamName, setTeamName] = useState("")
  const [teamLeader, setTeamLeader] = useState({ ...initialParticipantState })
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if (game && userId) {
      const alreadyRegistered = registeredGames.some((reg) => reg.gameId === game.id && reg.userId === userId)
      setIsRegistered(alreadyRegistered)
    }
    if (show && game) {
      // Set default registration type based on game configuration
      const defaultType = game.registrationType === "team" ? "team" :
        game.registrationType === "both" ? "individual" : "individual"
      setRegistrationType(defaultType)
      setTeamName("")
      setTeamLeader({ ...initialParticipantState })
      setTeamMembers([])
      setErrors({})
    }
  }, [game, userId, registeredGames, show])

  const handleTeamLeaderChange = (e) => {
    const { name, value } = e.target
    setTeamLeader((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleTeamMemberChange = (index, e) => {
    const { name, value } = e.target
    const updatedMembers = teamMembers.map((member, i) => (i === index ? { ...member, [name]: value } : member))
    setTeamMembers(updatedMembers)
    if (errors[`member-${index}-${name}`]) setErrors((prev) => ({ ...prev, [`member-${index}-${name}`]: "" }))
  }

  const addTeamMember = () => {
    const maxMembers = game?.maxTeamSize ? game.maxTeamSize - 1 : 3 // Subtract 1 for team leader
    if (teamMembers.length < maxMembers) {
      setTeamMembers((prev) => [...prev, { ...initialParticipantState }])
    } else {
      showToast(`Maximum ${maxMembers} additional team members allowed (${game?.maxTeamSize} total including leader)`, "warning")
    }
  }

  const removeTeamMember = (index) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index))
    const newErrors = { ...errors }
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`member-${index}-`)) delete newErrors[key]
    })
    setErrors(newErrors)
  }

  const validateParticipant = (participant, prefix = "") => {
    const newErrors = {}
    if (!participant.fullName.trim()) newErrors[`${prefix}fullName`] = "Full Name is required"
    if (!participant.email.trim()) {
      newErrors[`${prefix}email`] = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(participant.email)) {
      newErrors[`${prefix}email`] = "Invalid email format"
    }
    if (!participant.enrollmentNumber.trim()) newErrors[`${prefix}enrollmentNumber`] = "Enrollment Number is required"
    if (!participant.contactNumber.trim()) {
      newErrors[`${prefix}contactNumber`] = "Contact Number is required"
    } else if (!/^\d{10}$/.test(participant.contactNumber)) {
      newErrors[`${prefix}contactNumber`] = "Invalid 10-digit contact number"
    }
    if (!participant.collegeName.trim()) newErrors[`${prefix}collegeName`] = "College Name is required"
    if (!participant.semester.trim()) newErrors[`${prefix}semester`] = "Semester is required"
    if (!participant.branch.trim()) newErrors[`${prefix}branch`] = "Branch is required"
    if (!participant.gender.trim()) newErrors[`${prefix}gender`] = "Gender is required"
    if (!participant.degree.trim()) newErrors[`${prefix}degree`] = "Degree is required"
    return newErrors
  }

  const validateForm = () => {
    let newErrors = {}

    if (registrationType === "individual") {
      newErrors = { ...validateParticipant(teamLeader) }
    } else {
      // Team registration
      if (!teamName.trim()) newErrors.teamName = "Team Name is required"
      newErrors = { ...newErrors, ...validateParticipant(teamLeader, "leader-") }

      // Validate minimum team size
      const totalTeamSize = 1 + teamMembers.length // 1 for leader + members
      if (game?.minTeamSize && totalTeamSize < game.minTeamSize) {
        newErrors.teamSize = `Minimum team size is ${game.minTeamSize}. Please add ${game.minTeamSize - totalTeamSize} more member(s).`
      }

      teamMembers.forEach((member, index) => {
        newErrors = { ...newErrors, ...validateParticipant(member, `member-${index}-`) }
      })

      // Check duplicates between team leader and team members
      const leaderEmail = teamLeader.email.trim().toLowerCase()
      const leaderEnroll = teamLeader.enrollmentNumber.trim().toLowerCase()

      teamMembers.forEach((member, index) => {
        if (member.fullName.trim().toLowerCase() === teamLeader.fullName.trim().toLowerCase()) {
          newErrors[`member-${index}-fullName`] = "Team member name cannot be same as team leader"
        }
        if (member.email.trim().toLowerCase() === leaderEmail) {
          newErrors[`member-${index}-email`] = "Team member email cannot be same as team leader"
        }
        if (member.enrollmentNumber.trim().toLowerCase() === leaderEnroll) {
          newErrors[`member-${index}-enrollmentNumber`] = "Team member enrollment number cannot be same as team leader"
        }
      })

      // Also check duplicates among team members themselves
      for (let i = 0; i < teamMembers.length; i++) {
        for (let j = i + 1; j < teamMembers.length; j++) {
          if (
            teamMembers[i].email.trim().toLowerCase() === teamMembers[j].email.trim().toLowerCase()
          ) {
            newErrors[`member-${j}-email`] = "Duplicate team member email"
          }
          if (
            teamMembers[i].enrollmentNumber.trim().toLowerCase() ===
            teamMembers[j].enrollmentNumber.trim().toLowerCase()
          ) {
            newErrors[`member-${j}-enrollmentNumber`] = "Duplicate team member enrollment number"
          }
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      showToast("Please correct the errors in the form.", "error")
      return
    }
    setLoading(true)
    try {
      // Calculate total amount based on team size
      const calculateTotalAmount = () => {
        if (registrationType === "individual") {
          return game.registrationFee || game.baseFee
        } else {
          // For team registration, multiply by number of team members (leader + members)
          const totalMembers = 1 + teamMembers.length // 1 for leader + team members
          return (game.registrationFee || game.baseFee) * totalMembers
        }
      }

      const registrationData = {
        registrationType,
        gameId: game.id,
        gameName: game.name,
        gameDay: game.day,
        teamLeader,
        teamName: registrationType === "team" ? teamName : undefined,
        teamMembers: registrationType === "team" ? teamMembers : undefined,
        totalAmount: calculateTotalAmount(),
        specialRequirements: "" // Add any special requirements if needed
      }

      // Log registration data to console
      console.log("Registration Data Submitted:", registrationData)

      // Make actual API call to register for the game
      const response = await apiService.registerForGame(registrationData)

      if (response.success) {
        showToast("Registration successful!", "success")
        onRegisterGame() // Call the callback to refresh data
        handleClose()
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      showToast(error.message || "Registration failed. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const renderParticipantFields = (participant, handleChange, errors, prefix = "") => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(0, 212, 255, 0.1)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
    }}>
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Form.Label style={{
              color: '#00d4ff',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <User size={18} /> Full Name
            </Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={participant.fullName}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter full name"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${errors[`${prefix}fullName`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            />
            {errors[`${prefix}fullName`] && (
              <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors[`${prefix}fullName`]}
              </div>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Form.Label style={{
              color: '#00d4ff',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <Mail size={18} /> Email Address
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={participant.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter email address"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${errors[`${prefix}email`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            />
            {errors[`${prefix}email`] && (
              <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors[`${prefix}email`]}
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Form.Label style={{
              color: '#00d4ff',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <Hash size={18} /> Enrollment Number
            </Form.Label>
            <Form.Control
              type="text"
              name="enrollmentNumber"
              value={participant.enrollmentNumber}
              onChange={handleChange}
              disabled={loading}
              minLength={12}
              maxLength={12}
              placeholder="Enter enrollment number"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${errors[`${prefix}enrollmentNumber`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            />
            {errors[`${prefix}enrollmentNumber`] && (
              <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors[`${prefix}enrollmentNumber`]}
              </div>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Form.Label style={{
              color: '#00d4ff',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <Phone size={18} /> Contact Number
            </Form.Label>
            <Form.Control
              type="tel"
              name="contactNumber"
              value={participant.contactNumber}
              onChange={handleChange}
              disabled={loading}
              placeholder="10-digit mobile number"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${errors[`${prefix}contactNumber`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            />
            {errors[`${prefix}contactNumber`] && (
              <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors[`${prefix}contactNumber`]}
              </div>
            )}
          </div>
        </Col>
      </Row>

      <div className="mb-3">
        <Form.Label style={{
          color: '#00d4ff',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <Building2 size={18} /> College Name
        </Form.Label>
        <div className="position-relative">
          <Form.Control
            type="text"
            name="collegeName"
            value={participant.collegeName}
            onChange={(e) => {
              const value = e.target.value;
              handleChange(e);
              // Show dropdown when typing
              const dropdown = e.target.nextElementSibling;
              if (dropdown && value.length > 0) {
                dropdown.style.display = 'block';
              } else if (dropdown) {
                dropdown.style.display = 'none';
              }
            }}
            onFocus={(e) => {
              const dropdown = e.target.nextElementSibling;
              if (dropdown && e.target.value.length > 0) {
                dropdown.style.display = 'block';
              }
            }}
            onBlur={(e) => {
              // Delay hiding to allow clicking on dropdown items
              setTimeout(() => {
                const dropdown = e.target.nextElementSibling;
                if (dropdown) {
                  dropdown.style.display = 'none';
                }
              }, 200);
            }}
            disabled={loading}
            placeholder="Type to search your college or enter manually"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: `2px solid ${errors[`${prefix}collegeName`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
              borderRadius: '12px',
              color: 'white',
              padding: '12px 16px',
              fontSize: '16px'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#1a1f2e',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '8px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              display: 'none'
            }}
          >
            {collegesInGujarat
              .filter(college =>
                college.toLowerCase().includes(participant.collegeName.toLowerCase())
              )
              .slice(0, 10)
              .map((college, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: 'white',
                    borderBottom: '1px solid rgba(0, 212, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0, 212, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                  onClick={() => {
                    const event = {
                      target: {
                        name: 'collegeName',
                        value: college
                      }
                    };
                    handleChange(event);
                    // Hide dropdown
                    const dropdown = document.querySelector(`input[name="collegeName"]`).nextElementSibling;
                    if (dropdown) dropdown.style.display = 'none';
                  }}
                >
                  {college}
                </div>
              ))}
            {participant.collegeName &&
              !collegesInGujarat.some(college =>
                college.toLowerCase() === participant.collegeName.toLowerCase()
              ) && (
                <div
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: '#00d4ff',
                    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0, 212, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                  onClick={() => {
                    // Keep the current value as it's a custom college
                    const dropdown = document.querySelector(`input[name="collegeName"]`).nextElementSibling;
                    if (dropdown) dropdown.style.display = 'none';
                  }}
                >
                  <PlusCircle size={16} className="me-2" />
                  Add "{participant.collegeName}" as new college
                </div>
              )}
          </div>
        </div>
        {errors[`${prefix}collegeName`] && (
          <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
            {errors[`${prefix}collegeName`]}
          </div>
        )}
      </div>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Form.Label style={{ color: '#00d4ff', fontWeight: '500', marginBottom: '8px' }}>
              Semester
            </Form.Label>
            <Form.Select
              name="semester"
              value={participant.semester || ""}
              onChange={handleChange}
              disabled={loading}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${errors[`${prefix}semester`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            >
              <option value="" style={{ background: '#1a1f2e', color: 'white' }}>Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem} style={{ background: '#1a1f2e', color: 'white' }}>{sem}</option>
              ))}
            </Form.Select>
            {errors[`${prefix}semester`] && (
              <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors[`${prefix}semester`]}
              </div>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Form.Label style={{ color: '#00d4ff', fontWeight: '500', marginBottom: '8px' }}>
              Branch
            </Form.Label>
            <Form.Select
              name="branch"
              value={participant.branch || ""}
              onChange={handleChange}
              disabled={loading}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${errors[`${prefix}branch`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            >
              <option value="" style={{ background: '#1a1f2e', color: 'white' }}>Select Branch</option>
              {branches.map((br) => (
                <option key={br} value={br} style={{ background: '#1a1f2e', color: 'white' }}>{br}</option>
              ))}
            </Form.Select>
            {errors[`${prefix}branch`] && (
              <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors[`${prefix}branch`]}
              </div>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div className="mb-3">
            <Form.Label style={{ color: '#00d4ff', fontWeight: '500', marginBottom: '8px' }}>
              Gender
            </Form.Label>
            <Form.Select
              name="gender"
              value={participant.gender || ""}
              onChange={handleChange}
              disabled={loading}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${errors[`${prefix}gender`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            >
              <option value="" style={{ background: '#1a1f2e', color: 'white' }}>Select Gender</option>
              {genders.map((gender) => (
                <option key={gender} value={gender} style={{ background: '#1a1f2e', color: 'white' }}>{gender}</option>
              ))}
            </Form.Select>
            {errors[`${prefix}gender`] && (
              <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors[`${prefix}gender`]}
              </div>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <Form.Label style={{ color: '#00d4ff', fontWeight: '500', marginBottom: '8px' }}>
              Degree
            </Form.Label>
            <Form.Select
              name="degree"
              value={participant.degree || ""}
              onChange={handleChange}
              disabled={loading}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${errors[`${prefix}degree`] ? '#ff6b6b' : 'rgba(0, 212, 255, 0.3)'}`,
                borderRadius: '12px',
                color: 'white',
                padding: '12px 16px',
                fontSize: '16px'
              }}
            >
              <option value="" style={{ background: '#1a1f2e', color: 'white' }}>Select Degree</option>
              {degrees.map((degree) => (
                <option key={degree} value={degree} style={{ background: '#1a1f2e', color: 'white' }}>{degree}</option>
              ))}
            </Form.Select>
            {errors[`${prefix}degree`] && (
              <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                {errors[`${prefix}degree`]}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 25%, #0f3460 50%, #533a7d 75%, #1a0a2e 100%)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(138, 43, 226, 0.3), 0 0 100px rgba(0, 212, 255, 0.1)'
      }}>
        {/* Enhanced Tech Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ctext x='10' y='25' font-family='monospace' font-size='12' fill='%2300d4ff'%3E&lt;form&gt;%3C/text%3E%3Ctext x='70' y='25' font-family='monospace' font-size='12' fill='%2300d4ff'%3E&lt;input&gt;%3C/text%3E%3Ctext x='10' y='45' font-family='monospace' font-size='12' fill='%2300d4ff'%3E&lt;team&gt;%3C/text%3E%3Ctext x='70' y='45' font-family='monospace' font-size='12' fill='%2300d4ff'%3E&lt;user&gt;%3C/text%3E%3Ctext x='10' y='65' font-family='monospace' font-size='12' fill='%2300d4ff'%3E&lt;data&gt;%3C/text%3E%3Ctext x='70' y='65' font-family='monospace' font-size='12' fill='%2300d4ff'%3E&lt;reg&gt;%3C/text%3E%3Ctext x='10' y='85' font-family='monospace' font-size='12' fill='%2300d4ff'%3E&lt;/form&gt;%3C/text%3E%3Ctext x='70' y='85' font-family='monospace' font-size='12' fill='%2300d4ff'%3E&lt;/reg&gt;%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px'
        }}></div>

        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            background: 'linear-gradient(135deg, #007bff, #00d4ff)',
            border: 'none',
            color: 'white',
            borderRadius: '20px 20px 0 0',
            padding: '20px 24px'
          }}
        >
          <Modal.Title style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}>
            <Trophy size={24} />
            Register for {game?.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{
          background: 'transparent',
          color: '#f1f5f9',
          position: 'relative',
          zIndex: 2,
          padding: '24px'
        }}>
          {isRegistered ? (
            <Alert
              variant="success"
              className="text-center"
              style={{
                background: 'rgba(40, 167, 69, 0.1)',
                border: '1px solid rgba(40, 167, 69, 0.3)',
                color: '#28a745',
                borderRadius: '12px'
              }}
            >
              <Trophy size={20} className="me-2" />
              You are already registered for this game!
            </Alert>
          ) : isRegistrationExpired ? (
            <Alert
              variant="danger"
              className="text-center"
              style={{
                background: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                color: '#dc3545',
                borderRadius: '12px'
              }}
            >
              <AlertTriangle size={20} className="me-2" />
              Registration period has ended. No new registrations are accepted.
            </Alert>
          ) : (
            <>
              <div className="text-center mb-4">
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.1rem',
                  margin: 0
                }}>
                  Complete your registration for this exciting competition
                </p>
              </div>
              <Form onSubmit={handleSubmit}>
                {/* Registration Type - Show only if game allows both */}
                {game?.registrationType === "both" && (
                  <div className="mb-4 p-3" style={{
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '12px'
                  }}>
                    <Form.Label style={{
                      color: '#00d4ff',
                      fontWeight: '600',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Users size={18} /> Registration Type
                    </Form.Label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="individualRadio"
                          name="registrationType"
                          value="individual"
                          checked={registrationType === "individual"}
                          onChange={() => setRegistrationType("individual")}
                          disabled={loading}
                          style={{
                            accentColor: '#00d4ff'
                          }}
                        />
                        <label className="form-check-label" htmlFor="individualRadio" style={{
                          color: 'white',
                          fontWeight: '500'
                        }}>
                          Individual Participation
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="teamRadio"
                          name="registrationType"
                          value="team"
                          checked={registrationType === "team"}
                          onChange={() => setRegistrationType("team")}
                          disabled={loading}
                          style={{
                            accentColor: '#00d4ff'
                          }}
                        />
                        <label className="form-check-label" htmlFor="teamRadio" style={{
                          color: 'white',
                          fontWeight: '500'
                        }}>
                          Team ({game.minTeamSize}-{game.maxTeamSize} members)
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show game requirements */}
                {game && (
                  <div className="mb-4 p-3" style={{
                    background: 'rgba(0, 212, 255, 0.08)',
                    border: '1px solid rgba(0, 212, 255, 0.25)',
                    borderRadius: '12px'
                  }}>
                    <div className="d-flex align-items-center mb-2">
                      <Zap size={18} className="me-2" style={{ color: '#00d4ff' }} />
                      <strong style={{ color: '#00d4ff' }}>Game Requirements</strong>
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {game.registrationType === "team" && (
                        <div>• Team registration only ({game.minTeamSize}-{game.maxTeamSize} members)</div>
                      )}
                      {game.registrationType === "individual" && (
                        <div>• Individual registration only</div>
                      )}
                      {game.registrationType === "both" && (
                        <div>• Individual or Team registration ({game.minTeamSize}-{game.maxTeamSize} members for teams)</div>
                      )}
                      <div className="mt-2">
                        <strong style={{ color: '#00d4ff' }}>Registration Fee:</strong> ₹{game.baseFee} per participant
                      </div>
                    </div>
                  </div>
                )}

                {/* Show team size error if exists */}
                {errors.teamSize && (
                  <Alert variant="warning" className="mb-3">
                    {errors.teamSize}
                  </Alert>
                )}

                {registrationType === "team" && (
                  <div className="mb-4">
                    <Form.Label style={{
                      color: '#00d4ff',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <Users size={18} /> Team Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="teamName"
                      value={teamName}
                      onChange={(e) => {
                        setTeamName(e.target.value)
                        if (errors.teamName) setErrors((prev) => ({ ...prev, teamName: "" }))
                      }}
                      isInvalid={!!errors.teamName}
                      disabled={loading}
                      placeholder="Enter your team name"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '12px',
                        color: 'white',
                        padding: '12px 16px',
                        fontSize: '16px'
                      }}
                    />
                    {errors.teamName && (
                      <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '4px' }}>
                        {errors.teamName}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <h4 style={{
                    color: '#00d4ff',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    <UserPlus size={20} />
                    {registrationType === "individual" ? "Your Details" : "Team Leader Details"}
                  </h4>
                </div>
                {renderParticipantFields(teamLeader, handleTeamLeaderChange, errors, registrationType === "team" ? "leader-" : "")}

                {registrationType === "team" && (
                  <>
                    <div className="mb-4 mt-4">
                      <h4 style={{
                        color: '#00d4ff',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '20px'
                      }}>
                        <Users size={20} />
                        Other Team Members
                      </h4>

                      {teamMembers.length === 0 && (
                        <div className="text-center p-4" style={{
                          background: 'rgba(0, 212, 255, 0.05)',
                          border: '1px solid rgba(0, 212, 255, 0.2)',
                          borderRadius: '12px',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          <UserPlus size={24} className="mb-2" style={{ color: '#00d4ff' }} />
                          <p className="mb-0">No additional team members added yet.</p>
                          <small>Click "Add Team Member" to add more participants.</small>
                        </div>
                      )}

                      {teamMembers.map((member, index) => (
                        <div key={index} className="mb-4" style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(0, 212, 255, 0.15)',
                          borderRadius: '16px',
                          padding: '20px',
                          position: 'relative'
                        }}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 style={{
                              color: '#00d4ff',
                              fontWeight: '600',
                              margin: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <User size={18} />
                              Team Member {index + 1}
                            </h5>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeTeamMember(index)}
                              disabled={loading}
                              style={{
                                background: 'rgba(255, 107, 107, 0.1)',
                                border: '1px solid rgba(255, 107, 107, 0.3)',
                                color: '#ff6b6b',
                                borderRadius: '8px'
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          {renderParticipantFields(member, (e) => handleTeamMemberChange(index, e), errors, `member-${index}-`)}
                        </div>
                      ))}

                      <div className="d-flex gap-3 mb-4">
                        <Button
                          onClick={addTeamMember}
                          disabled={loading || teamMembers.length >= (game?.maxTeamSize - 1)}
                          style={{
                            background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 20px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                          }}
                        >
                          <UserPlus size={18} />
                          Add Team Member
                        </Button>
                        {teamMembers.length > 0 && (
                          <Button
                            onClick={() => setTeamMembers([])}
                            disabled={loading}
                            style={{
                              background: 'rgba(255, 107, 107, 0.1)',
                              border: '1px solid rgba(255, 107, 107, 0.3)',
                              color: '#ff6b6b',
                              borderRadius: '12px',
                              padding: '12px 20px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <Trash2 size={18} />
                            Clear All
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Registration Fee Display */}
                <div className="mb-4 p-3" style={{
                  background: 'rgba(0, 212, 255, 0.08)',
                  border: '1px solid rgba(0, 212, 255, 0.25)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <CreditCard size={18} className="me-2" style={{ color: '#00d4ff' }} />
                    <strong style={{ color: '#00d4ff' }}>Total Registration Fee</strong>
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#00d4ff',
                    marginBottom: '8px'
                  }}>
                    ₹{registrationType === "individual"
                      ? (game?.registrationFee || game?.baseFee)
                      : (game?.registrationFee || game?.baseFee) * (1 + teamMembers.length)
                    }
                  </div>
                  {registrationType === "team" && (
                    <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Base fee: ₹{game?.registrationFee || game?.baseFee} × {1 + teamMembers.length} members
                    </small>
                  )}
                </div>

                <div className="d-grid gap-3 mt-4">
                  <Button
                    type="submit"
                    disabled={loading || isRegistered || isRegistrationExpired}
                    style={{
                      background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 24px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      boxShadow: '0 6px 20px rgba(0, 212, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Trophy size={20} />
                        Complete Registration
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleClose}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </div>
    </Modal>
  )
}

export default RegistrationForm