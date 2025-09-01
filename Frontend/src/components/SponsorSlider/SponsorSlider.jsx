import React, { useCallback, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SponsorSlider = () => {
      // Embla carousel setup with autoplay
      const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 })
      
      // Autoplay functionality with pause on hover
      const [autoplayEnabled, setAutoplayEnabled] = useState(true)
      
      useEffect(() => {
            if (emblaApi && autoplayEnabled) {
                  const autoplayInterval = setInterval(() => {
                        emblaApi.scrollNext()
                  }, 3000) // Change slide every 3 seconds
                  
                  return () => {
                        clearInterval(autoplayInterval)
                  }
            }
      }, [emblaApi, autoplayEnabled])
      
      // Handlers for pausing autoplay on hover
      const handleMouseEnter = () => setAutoplayEnabled(false)
      const handleMouseLeave = () => setAutoplayEnabled(true)
      
      // Navigation buttons
      const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
      const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
      
      // Real company logos for demo with descriptions and website links
      const sponsors = [
            { 
                  id: 1, 
                  name: 'Google', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
                  description: 'Search engine and cloud computing leader',
                  website: 'https://www.google.com'
            },
            { 
                  id: 2, 
                  name: 'Microsoft', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
                  description: 'Software and cloud services pioneer',
                  website: 'https://www.microsoft.com'
            },
            { 
                  id: 3, 
                  name: 'Amazon', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
                  description: 'E-commerce and cloud computing giant',
                  website: 'https://www.amazon.com'
            },
            { 
                  id: 4, 
                  name: 'Meta', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
                  description: 'Social media and virtual reality innovator',
                  website: 'https://www.meta.com'
            },
            { 
                  id: 5, 
                  name: 'Apple', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
                  description: 'Consumer electronics and software company',
                  website: 'https://www.apple.com'
            },
            { 
                  id: 6, 
                  name: 'IBM', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
                  description: 'Enterprise technology and consulting services',
                  website: 'https://www.ibm.com'
            },
            { 
                  id: 7, 
                  name: 'Intel', 
                  logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg',
                  description: 'Semiconductor chip manufacturer',
                  website: 'https://www.intel.com'
            },
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
                        opacity: 0.05,
                        backgroundImage: `radial-gradient(circle at 25% 25%, #00d4ff 0%, transparent 50%), 
                                         radial-gradient(circle at 75% 75%, #007bff 0%, transparent 50%)`,
                        backgroundSize: '600px 600px',
                        animation: 'float 20s ease-in-out infinite'
                  }}></div>

                  <Container style={{ position: 'relative', zIndex: 1 }}>
                        <div className="text-center mb-5">
                              <div style={{
                                    display: 'inline-block',
                                    background: 'rgba(0, 212, 255, 0.1)',
                                    border: '1px solid rgba(0, 212, 255, 0.3)',
                                    borderRadius: '50px',
                                    padding: '8px 20px',
                                    marginBottom: '20px'
                              }}>
                                    <span style={{ color: '#00d4ff', fontSize: '0.9rem', fontWeight: '600' }}>
                                      🤝 PARTNERSHIPS
                                    </span>
                              </div>
                              <h2 style={{
                                    background: 'linear-gradient(135deg, #00d4ff 0%, #007bff 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontWeight: '800',
                                    marginBottom: '1rem',
                                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                    letterSpacing: '-0.02em'
                              }}>
                                    Our Sponsors
                              </h2>
                              <p style={{ 
                                    color: 'rgba(255, 255, 255, 0.8)', 
                                    fontSize: '1.3rem',
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                    lineHeight: '1.6'
                              }}>
                                    Proudly supported by industry leaders driving innovation and excellence
                              </p>
                        </div>

                        <div className="sponsors-carousel-container">
                              {/* Carousel Navigation Buttons */}
                              <div className="carousel-buttons">
                                    <button className="carousel-button prev" onClick={scrollPrev}>
                                          <ChevronLeft size={24} />
                                    </button>
                                    <button className="carousel-button next" onClick={scrollNext}>
                                          <ChevronRight size={24} />
                                    </button>
                              </div>
                              
                              {/* Embla Carousel */}
                              <div 
                    className="embla"
                    lg={10} 
                    ref={emblaRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
              >
                                    <div className="embla__container">
                                          {sponsors.map((sponsor) => (
                                                <div className="embla__slide" key={sponsor.id}>
                                                      <a 
                                                            href={sponsor.website} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="sponsor-card-link"
                                                      >
                                                            <div className="sponsor-card">
                                                                  <div className="sponsor-logo-container">
                                                                        <img
                                                                              src={sponsor.logo}
                                                                              alt={sponsor.name}
                                                                              className="sponsor-logo"
                                                                        />
                                                                  </div>
                                                                  <div className="sponsor-info">
                                                                        <h4 className="sponsor-name">{sponsor.name}</h4>
                                                                        <p className="sponsor-description">{sponsor.description}</p>
                                                                  </div>
                                                                  <div className="visit-website">
                                                                        <span>Visit Website</span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                                                                              <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                                                                        </svg>
                                                                  </div>
                                                            </div>
                                                      </a>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </Container>

                  <style>{`
        
        /* Embla Carousel Styles */
        .sponsors-carousel-container {
          position: relative;
          margin-bottom: 60px;
        }
        
        .embla {
          overflow: hidden;
          padding: 20px 0;
        }
        
        .embla__container {
          display: flex;
          align-items: stretch;
          height: 100%;
        }
        
        .embla__slide {
          flex: 0 0 33.33%; /* Show 3 slides at once */
          min-width: 0;
          padding: 0 15px;
          position: relative;
        }
        
        /* Carousel Navigation */
        .carousel-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .carousel-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .carousel-button:hover {
          background: rgba(0, 212, 255, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 212, 255, 0.15);
        }
        
        .carousel-button:focus {
          outline: none;
        }
        
        /* Sponsor Card Styles */
        .sponsor-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }

        .sponsor-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 212, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          padding: 25px;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .sponsor-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 212, 255, 0.1);
        }

        .sponsor-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100px;
          margin-bottom: 20px;
        }

        .sponsor-logo {
          max-width: 140px;
          max-height: 70px;
          object-fit: contain;
          filter: brightness(0) invert(1) opacity(0.7);
          transition: all 0.3s ease;
        }

        .sponsor-card:hover .sponsor-logo {
          filter: brightness(0) invert(1) opacity(1);
          transform: scale(1.05);
        }

        .sponsor-info {
          text-align: center;
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .sponsor-name {
          color: #00d4ff;
          font-weight: 600;
          font-size: 1.3rem;
          margin-bottom: 10px;
        }

        .sponsor-description {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 0;
        }

        .visit-website {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #00d4ff;
          font-size: 0.9rem;
          font-weight: 500;
          opacity: 0.8;
          transition: all 0.3s ease;
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid rgba(0, 212, 255, 0.1);
        }

        .sponsor-card:hover .visit-website {
          opacity: 1;
          color: #00eaff;
        }

        @media (max-width: 1200px) {
          .embla__slide {
            flex: 0 0 50%; /* Show 2 slides on medium screens */
          }
        }
        
        @media (max-width: 768px) {
          .embla__slide {
            flex: 0 0 100%; /* Show 1 slide on small screens */
          }
          
          .sponsor-logo {
            max-width: 110px;
            max-height: 55px;
          }
          
          .sponsor-name {
            font-size: 1.1rem;
          }
          
          .sponsor-description {
            font-size: 0.85rem;
          }
        }
      `}</style>
            </div>
      )
}

export default SponsorSlider