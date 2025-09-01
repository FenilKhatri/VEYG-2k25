import React, { useEffect, useState, useCallback } from "react";
import { Container } from "react-bootstrap";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import "./SponsorSlider.css"; // Importing the external CSS

const SponsorSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });
  const [autoplay, setAutoplay] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (emblaApi && autoplay) {
      const autoplayInterval = setInterval(() => emblaApi.scrollNext(), 3000);
      return () => clearInterval(autoplayInterval);
    }
  }, [emblaApi, autoplay]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const sponsors = [
    {
      id: 1,
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      description: "Search engine and cloud computing leader",
      website: "https://www.google.com",
    },
    {
      id: 2,
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      description: "Software and cloud services pioneer",
      website: "https://www.microsoft.com",
    },
    {
      id: 3,
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      description: "E-commerce and cloud computing giant",
      website: "https://www.amazon.com",
    },
    {
      id: 4,
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      description: "Social media and virtual reality innovator",
      website: "https://www.meta.com",
    },
    {
      id: 5,
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      description: "Consumer electronics and software company",
      website: "https://www.apple.com",
    },
    {
      id: 6,
      name: "IBM",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      description: "Enterprise technology and consulting services",
      website: "https://www.ibm.com",
    },
    {
      id: 7,
      name: "Intel",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg",
      description: "Semiconductor chip manufacturer",
      website: "https://www.intel.com",
    },
  ];

  return (
    <div className="sponsor-slider" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Container className="sponsor-container">
        {/* Header */}
        <div className="sponsor-header text-center mb-5">
          <motion.div
            className="tag"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            🤝 PARTNERSHIPS
          </motion.div>

          <motion.h2
            className="sponsor-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Our Sponsors
          </motion.h2>

          <motion.p
            className="sponsor-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Proudly supported by global industry leaders driving innovation and excellence.
          </motion.p>
        </div>

        {/* Carousel Controls */}
        <div className="carousel-buttons">
          <button className="carousel-button" onClick={scrollPrev}>
            <ChevronLeft size={28} />
          </button>
          <button className="carousel-button" onClick={scrollNext}>
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Embla Carousel */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {sponsors.map((sponsor, index) => (
              <motion.div
                className="embla__slide"
                key={sponsor.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="sponsor-card-link">
                  <div className="sponsor-card">
                    <div className="sponsor-logo-container">
                      <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />
                    </div>
                    <div className="sponsor-info">
                      <h4 className="sponsor-name">{sponsor.name}</h4>
                      <p className="sponsor-description">{sponsor.description}</p>
                    </div>
                    <div className="visit-website">
                      <span>Visit Website</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path
                          fillRule="evenodd"
                          d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SponsorSlider;