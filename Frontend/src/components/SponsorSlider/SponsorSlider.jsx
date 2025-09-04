import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import "./SponsorSlider.css";

const SponsorSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const sponsors = [
    {
      id: 1,
      name: "Abacus Peripherals Pvt. Ltd.",
      logo: "/Sponsors_images/Abacus Peripherals Pvt. Ltd..png",
      description: "India's 1st & Largest DRAM Manufacturer",
      website: "https://in.linkedin.com/company/abacusindia",
    },
    {
      id: 2,
      name: "Accent Engineering & Design Services",
      logo: "/Sponsors_images/Accent Engineering & Design Sevices.png",
      description: "World-class & cost-effective engineering solutions",
      website: "https://in.linkedin.com/company/accentengineering&designservices",
    },
    {
      id: 3,
      name: "Amin Infomark Pvt. Ltd.",
      logo: "/Sponsors_images/Amin Infomark Pvt. Ltd.png",
      description: "Leading IT company based in Ahmedabad",
      website: "https://www.zaubacorp.com/AMIN-INFOMARK-PRIVATE-LIMITED-U72200GJ2013PTC077136",
    },
    {
      id: 4,
      name: "Pipefit Engineers Pvt. Ltd.",
      logo: "/Sponsors_images/Pipefit Engineers Pvt. Ltd..png",
      description:
        "Manufacturer of Forged Pipe Fittings, Butt Welded Fittings & SS Flanges",
      website:
        "https://www.indiamart.com/pipefitengineers/about-us.html?srsltid=AfmBOooykunCwiK2XxpVfXjdDeHHZRvXlh0VyaH6n-ABC4xLmElRgOuk",
    },
  ];

  // Continuous auto-play without delay
  useEffect(() => {
    if (emblaApi) {
      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 2000); // Reduced delay to 2 seconds

      return () => {
        clearInterval(interval);
      };
    }
  }, [emblaApi]);

  return (
    <div className="sponsor-slider">
      <Container className="sponsor-container">
        {/* Header */}
        <motion.div
          className="sponsor-header text-center mb-5"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="tag"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            🤝 PARTNERSHIPS
          </motion.div>

          <h2 className="sponsor-title">Our Sponsors</h2>
          <p className="sponsor-subtitle">
            Proudly supported by industry leaders driving innovation and excellence.
          </p>
        </motion.div>


        {/* Embla Carousel */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {sponsors.map((sponsor, index) => (
              <motion.div
                className="embla__slide"
                key={sponsor.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-card-link"
                >
                  <motion.div
                    className="sponsor-card"
                    whileHover={{ scale: 1.07, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 250 }}
                  >
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                        />
                      </svg>
                    </div>
                  </motion.div>
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