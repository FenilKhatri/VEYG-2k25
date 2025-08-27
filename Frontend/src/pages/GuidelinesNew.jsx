import React from 'react'
import { Container, Card, Badge, Button, Accordion } from 'react-bootstrap'
import { Calendar, Clock, MapPin, Shield, Laptop, CheckCircle, Users, Trophy, Target, Zap } from 'lucide-react'
import PageHeroSection from '../components/HeroSection/PageHeroSection'
import { games } from '../data/gamesData'

const Guidelines = () => {
  const eventSchedule = [
    {
      day: "Day 1",
      date: "15 September 2025",
      games: [
        { name: "Algo Cricket", venue: "Lab 1", gameId: 1 },
        { name: "BrainGo", venue: "Seminar Hall", gameId: 2 },
      ],
    },
    {
      day: "Day 2",
      date: "16 September 2025",
      games: [
        { name: "Logo2Logic", venue: "Lab 2", gameId: 3 },
        { name: "Blind Code to Key", venue: "Lab 3 & Seminar Hall", gameId: 4 },
      ],
    },
  ]

  // Get estimated time from gameData
  const getEstimatedTime = (gameId) => {
    const game = games.find(g => g.id === gameId)
    return game ? game.estimatedTime : "2 hours"
  }

  const registrationGuidelines = [
    {
      title: "Registration Requirements",
      description: "Complete online registration is mandatory before event participation.",
      icon: <Users size={20} style={{ color: '#00d4ff' }} />
    },
    {
      title: "One Game Per Day Rule",
      description: "Participants can register for only ONE game per day (Day 1 or Day 2).",
      icon: <Calendar size={20} style={{ color: '#00d4ff' }} />
    },
    {
      title: "Team Presence",
      description: "All registered team members must be present during the event.",
      icon: <Users size={20} style={{ color: '#00d4ff' }} />
    },
    {
      title: "Punctuality",
      description: "Late arrivals (more than 15 minutes) will result in disqualification.",
      icon: <Clock size={20} style={{ color: '#00d4ff' }} />
    },
    {
      title: "ID Verification",
      description: "Valid college ID cards are required for participant verification.",
      icon: <Shield size={20} style={{ color: '#00d4ff' }} />
    },
    {
      title: "Payment Policy",
      description: "Registration fees are non-refundable under any circumstances.",
      icon: <Trophy size={20} style={{ color: '#00d4ff' }} />
    }
  ]

  const conductGuidelines = [
    {
      title: "Fair Play Policy",
      description: "Any form of cheating or unfair means will lead to immediate disqualification.",
      icon: <Shield size={20} style={{ color: '#ff00e5' }} />
    },
    {
      title: "Device Etiquette",
      description: "Mobile phones must be kept on silent mode during competitions.",
      icon: <Laptop size={20} style={{ color: '#ff00e5' }} />
    },
    {
      title: "Dress Code",
      description: "Participants must follow formal/semi-formal attire guidelines.",
      icon: <Users size={20} style={{ color: '#ff00e5' }} />
    },
    {
      title: "Final Authority",
      description: "Event organizers' decisions will be final and binding in all matters.",
      icon: <Trophy size={20} style={{ color: '#ff00e5' }} />
    }
  ]

  const technicalGuidelines = [
    {
      title: "External Storage Policy",
      description: "Use of external storage devices is strictly prohibited during game time.",
      icon: <Shield size={20} style={{ color: '#ffd700' }} />
    },
    {
      title: "Programming Languages",
      description: "Any programming language allowed unless specified otherwise for specific games.",
      icon: <Laptop size={20} style={{ color: '#ffd700' }} />
    },
    {
      title: "Code Submission",
      description: "All code submissions must be done through the provided platform only.",
      icon: <Target size={20} style={{ color: '#ffd700' }} />
    },
    {
      title: "Development Tools",
      description: "Debugging tools and IDEs are allowed as per individual game-specific rules.",
      icon: <Zap size={20} style={{ color: '#ffd700' }} />
    },
    {
      title: "Data Safety",
      description: "Participants must save their work frequently to avoid any data loss.",
      icon: <Shield size={20} style={{ color: '#ffd700' }} />
    },
    {
      title: "Technical Support",
      description: "Dedicated technical support will be available throughout the event duration.",
      icon: <Users size={20} style={{ color: '#ffd700' }} />
    }
  ]

  return (
    <>
      <PageHeroSection
        title="Event Guidelines"
        subtitle="Essential Rules & Regulations"
        icon={Shield}
        description="Essential guidelines for participants to ensure fair play and smooth event execution. Read carefully before registering."
      />

      <div style={{
        background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
        minHeight: '100vh',
        margin: 0,
        padding: 0
      }}>
        <Container style={{ paddingTop: '40px', paddingBottom: '60px' }}>

          {/* Event Schedule Timeline */}
          <Card className="mb-5" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}>
            <Card.Header style={{
              background: 'rgba(0, 234, 255, 0.1)',
              border: 'none',
              borderRadius: '15px 15px 0 0',
              textAlign: 'center'
            }}>
              <Card.Title style={{
                color: '#00d4ff',
                fontSize: '1.5rem',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <Calendar size={24} />
                Event Schedule Timeline
              </Card.Title>
              <Card.Text style={{ color: '#94a3b8', margin: '10px 0 0 0' }}>
                Complete schedule for VEYG 2K25 gaming events
              </Card.Text>
            </Card.Header>
            <Card.Body style={{ padding: '40px' }}>
              <div style={{ position: 'relative' }}>
                {/* Timeline Line */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '100%',
                  background: 'rgba(0, 234, 255, 0.3)',
                  borderRadius: '2px'
                }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {eventSchedule.flatMap((day, dayIndex) =>
                    day.games.map((game, gameIndex) => {
                      const globalIndex = dayIndex * 2 + gameIndex
                      const isLeft = globalIndex % 2 === 0

                      return (
                        <div key={`${dayIndex}-${gameIndex}`} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          {/* Timeline Dot */}
                          <div style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '24px',
                            height: '24px',
                            background: '#00d4ff',
                            borderRadius: '50%',
                            border: '4px solid #0a0e1a',
                            zIndex: 10
                          }}></div>

                          {/* Content */}
                          <div style={{
                            width: '45%',
                            ...(isLeft ? { paddingRight: '30px' } : { marginLeft: 'auto', paddingLeft: '30px' })
                          }}>
                            <Card style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '12px',
                              backdropFilter: 'blur(10px)'
                            }}>
                              <Card.Header style={{ paddingBottom: '10px', border: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                  <Badge bg="primary" style={{ background: '#00d4ff', color: '#000' }}>
                                    {day.day}
                                  </Badge>
                                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>{day.date}</span>
                                </div>
                                <Card.Title style={{ color: '#00d4ff', fontSize: '1.1rem', margin: 0 }}>
                                  {game.name}
                                </Card.Title>
                              </Card.Header>
                              <Card.Body style={{ paddingTop: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#94a3b8' }}>
                                    <Clock size={16} />
                                    Estimated Time: {getEstimatedTime(game.gameId)}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#94a3b8' }}>
                                    <MapPin size={16} />
                                    {game.venue}
                                  </div>
                                  <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={() => window.location.href = `/game/${game.gameId}`}
                                    style={{
                                      marginTop: '10px',
                                      width: '100%',
                                      background: 'transparent',
                                      borderColor: '#00d4ff',
                                      color: '#00d4ff'
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Guidelines Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
              {/* Registration Guidelines */}
              <Accordion.Item eventKey="0" style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                marginBottom: '15px'
              }}>
                <Accordion.Header style={{ border: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Users size={24} style={{ color: '#00d4ff' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#00d4ff', margin: 0 }}>
                      Registration & Participation Guidelines
                    </h3>
                  </div>
                </Accordion.Header>
                <Accordion.Body style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {registrationGuidelines.map((guideline, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '20px',
                          background: 'rgba(0, 234, 255, 0.1)',
                          borderRadius: '12px',
                          border: '1px solid rgba(0, 234, 255, 0.2)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ flexShrink: 0, marginTop: '2px' }}>
                          {guideline.icon}
                        </div>
                        <div>
                          <h4 style={{ color: '#00d4ff', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                            {guideline.title}
                          </h4>
                          <p style={{ color: '#f1f5f9', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
                            {guideline.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* Conduct Guidelines */}
              <Accordion.Item eventKey="1" style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                marginBottom: '15px'
              }}>
                <Accordion.Header style={{ border: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={24} style={{ color: '#ff00e5' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ff00e5', margin: 0 }}>
                      Conduct & Behavior Guidelines
                    </h3>
                  </div>
                </Accordion.Header>
                <Accordion.Body style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {conductGuidelines.map((guideline, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '20px',
                          background: 'rgba(255, 0, 229, 0.1)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 0, 229, 0.2)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ flexShrink: 0, marginTop: '2px' }}>
                          {guideline.icon}
                        </div>
                        <div>
                          <h4 style={{ color: '#ff00e5', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                            {guideline.title}
                          </h4>
                          <p style={{ color: '#f1f5f9', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
                            {guideline.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* Technical Guidelines */}
              <Accordion.Item eventKey="2" style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)'
              }}>
                <Accordion.Header style={{ border: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Laptop size={24} style={{ color: '#ffd700' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffd700', margin: 0 }}>
                      Technical Guidelines
                    </h3>
                  </div>
                </Accordion.Header>
                <Accordion.Body style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {technicalGuidelines.map((guideline, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '20px',
                          background: 'rgba(255, 215, 0, 0.1)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 215, 0, 0.2)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ flexShrink: 0, marginTop: '2px' }}>
                          {guideline.icon}
                        </div>
                        <div>
                          <h4 style={{ color: '#ffd700', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                            {guideline.title}
                          </h4>
                          <p style={{ color: '#f1f5f9', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
                            {guideline.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Container>
      </div>
    </>
  )
}

export default Guidelines
