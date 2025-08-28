import React from 'react'
import { Container } from 'react-bootstrap'

const SponsorSlider = () => {
      // Real company logos for demo
      const sponsors = [
            { id: 1, name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
            { id: 2, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
            { id: 3, name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
            { id: 4, name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
            { id: 5, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
      ]

      return (
            <div style={{
                  background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
                  padding: '80px 0',
                  overflow: 'hidden',
                  position: 'relative'
            }}>
                  {/* Background Pattern */}
                  <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.03,
                        backgroundImage: `radial-gradient(circle at 25% 25%, #00d4ff 0%, transparent 50%), 
                                         radial-gradient(circle at 75% 75%, #007bff 0%, transparent 50%)`,
                        backgroundSize: '400px 400px'
                  }}></div>

                  <Container style={{ position: 'relative', zIndex: 1 }}>
                        <div className="text-center mb-5">
                              <h2 style={{
                                    color: '#00d4ff',
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                    fontSize: '2.5rem'
                              }}>
                                    Our Sponsors
                              </h2>
                              <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                                    Proudly supported by industry leaders
                              </p>
                        </div>

                        <div className="sponsor-slider-container">
                              <div className="sponsor-track">
                                    {/* First set of sponsors */}
                                    {sponsors.map((sponsor) => (
                                          <div key={sponsor.id} className="sponsor-item">
                                                <img
                                                      src={sponsor.logo}
                                                      alt={sponsor.name}
                                                      className="sponsor-logo"
                                                />
                                          </div>
                                    ))}
                                    {/* Duplicate set for seamless loop */}
                                    {sponsors.map((sponsor) => (
                                          <div key={`${sponsor.id}-duplicate`} className="sponsor-item">
                                                <img
                                                      src={sponsor.logo}
                                                      alt={sponsor.name}
                                                      className="sponsor-logo"
                                                />
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </Container>

                  <style>{`
        .sponsor-slider-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .sponsor-track {
          display: flex;
          animation: scroll 25s linear infinite;
          width: calc(200px * ${sponsors.length * 2} + 60px * ${sponsors.length * 2});
        }

        .sponsor-item {
          flex-shrink: 0;
          width: 200px;
          height: 100px;
          margin: 0 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 212, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .sponsor-item:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 212, 255, 0.1);
        }

        .sponsor-logo {
          max-width: 140px;
          max-height: 70px;
          object-fit: contain;
          filter: brightness(0) invert(1) opacity(0.7);
          transition: all 0.3s ease;
        }

        .sponsor-item:hover .sponsor-logo {
          filter: brightness(0) invert(1) opacity(1);
          transform: scale(1.05);
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-200px * ${sponsors.length} - 60px * ${sponsors.length}));
          }
        }

        .sponsor-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .sponsor-item {
            width: 150px;
            height: 80px;
            margin: 0 20px;
          }
          
          .sponsor-logo {
            max-width: 110px;
            max-height: 55px;
          }
          
          .sponsor-track {
            width: calc(150px * ${sponsors.length * 2} + 40px * ${sponsors.length * 2});
            animation: scrollMobile 20s linear infinite;
          }
          
          @keyframes scrollMobile {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-150px * ${sponsors.length} - 40px * ${sponsors.length}));
            }
          }
        }
      `}</style>
            </div>
      )
}

export default SponsorSlider