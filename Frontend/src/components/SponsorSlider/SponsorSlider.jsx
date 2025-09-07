import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import useEmblaCarousel from "embla-carousel-react";

const SponsorSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const autoPlayRef = useRef(null);
  const isHovered = useRef(false);
  const isVisible = useRef(true);

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

  // Start autoplay (discrete slide next) with safety checks
  const startAutoplay = () => {
    // Do not start if reduced motion is requested
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (autoPlayRef.current) return; // already running
    autoPlayRef.current = setInterval(() => {
      if (emblaApi && !isHovered.current && isVisible.current) {
        // Defensive: only call if emblaApi can scroll
        try {
          emblaApi.scrollNext();
        } catch (e) {
          // ignore
        }
      }
    }, 3000); // change this value to speed up / slow down (ms)
  };

  const stopAutoplay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  useEffect(() => {
    if (!emblaApi) return;

    startAutoplay();

    // Pause autoplay while user is interacting with the carousel by pointer
    const onPointerDown = () => stopAutoplay();
    emblaApi.on("pointerDown", onPointerDown);

    // Pause when tab hidden, resume when visible again
    const handleVisibility = () => {
      isVisible.current = document.visibilityState === "visible";
      if (!isVisible.current) stopAutoplay();
      else startAutoplay();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    // Clean up
    return () => {
      stopAutoplay();
      emblaApi.off("pointerDown", onPointerDown);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [emblaApi]);

  // Respect hover and focus to pause autoplay
  const handleMouseEnter = () => {
    isHovered.current = true;
    stopAutoplay();
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    startAutoplay();
  };

  const handleFocusIn = () => {
    isHovered.current = true;
    stopAutoplay();
  };

  const handleFocusOut = () => {
    isHovered.current = false;
    startAutoplay();
  };

  return (
    <div className="sponsor-slider" data-component="SponsorSlider">
      {/* Embedded CSS: placed here so this is a single-file component */}
      <style>{`
/* =========================================================
   SponsorSlider (single-file) — Embedded CSS
   Keep CSS class names aligned with the JSX below.
   Reduced- and accessibility considered.
========================================================= */

.sponsor-slider {
      /* Core palette */
      --bg-0: #06080d;
      --bg-1: #0f2027;
      --bg-2: #2c5364;
      --card: rgba(255, 255, 255, 0.06);
      --card-border: rgba(0, 234, 255, 0.25);
      --card-border-strong: rgba(0, 234, 255, 0.55);
      --primary: #00eaff;
      --primary-2: #3b82f6;
      --accent: #22d3ee;
      --text: #e6f4ff;
      --muted: #9fb3c7;

      /* Effects */
      --ring: 0 0 0 3px rgba(0, 234, 255, 0.25);
      --shadow-soft: 0 10px 35px rgba(0, 0, 0, 0.35);
      --shadow-strong: 0 20px 60px rgba(0, 234, 255, 0.25);

      /* Sizing */
      --slide-min: 280px;
      --slide-max: 420px;
      --radius-lg: 20px;
      --radius-xl: 22px;

      /*  */
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-in: cubic-bezier(0.32, 0, 0.67, 0);

      position: relative;
      overflow: hidden;
      padding: clamp(64px, 8vw, 110px) 0;
      color: var(--text);
      background:
            radial-gradient(1200px 500px at 15% -10%, rgba(0, 234, 255, 0.1), transparent 60%),
            radial-gradient(1100px 500px at 85% 110%, rgba(59, 130, 246, 0.12), transparent 55%),
            linear-gradient(135deg, var(--bg-0) 0%, var(--bg-1) 48%, var(--bg-2) 100%);
}

.sponsor-slider::before {
      content: "";
      position: absolute;
      inset: -30%;
      background:
            conic-gradient(from 180deg at 50% 50%,
                  rgba(0, 234, 255, 0.06),
                  rgba(59, 130, 246, 0.05),
                  rgba(34, 211, 238, 0.06),
                  rgba(0, 234, 255, 0.06));
      filter: blur(60px);
      mix-blend-mode: screen;
      animation: auroraMove 18s linear infinite;
      pointer-events: none;
}

.sponsor-slider::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 36px 36px, 36px 36px;
      mask-image: radial-gradient(60% 60% at 50% 50%, black 40%, transparent 100%);
      pointer-events: none;
}

.sponsor-header .tag {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 9px 20px;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.08em;
      font-size: 0.88rem;
      color: var(--primary);
      background: rgba(0, 234, 255, 0.08);
      border: 1px solid rgba(0, 234, 255, 0.35);
      box-shadow: 0 0 0 1px rgba(0, 234, 255, 0.08) inset, var(--shadow-soft);
      transition: transform 0.25s var(--ease-out), box-shadow 0.3s var(--ease-out);
      will-change: transform, box-shadow;
}

.sponsor-header .tag:hover {
      transform: translateY(-1px) scale(1.03);
      box-shadow: 0 0 18px rgba(0, 234, 255, 0.32);
}

.sponsor-title {
      margin: 10px 0 12px;
      font-weight: 900;
      letter-spacing: -0.02em;
      font-size: clamp(2.2rem, 5vw, 3.6rem);
      line-height: 1.08;
      background: linear-gradient(135deg, var(--primary), var(--primary-2) 60%, #8be9ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 6px 22px rgba(0, 234, 255, 0.15);
}

.sponsor-subtitle {
      max-width: 720px;
      margin-inline: auto;
      color: var(--muted);
      font-size: clamp(1.05rem, 1.2vw, 1.25rem);
      line-height: 1.7;
}

.embla {
      overflow: hidden;
      padding: 10px 0 6px;
      -webkit-overflow-scrolling: touch;
      contain: layout paint;
}

.embla__container {
      display: flex;
      align-items: stretch;
      gap: clamp(16px, 2vw, 28px);
      will-change: transform;
}

.embla__slide {
      flex: 0 0 clamp(var(--slide-min), 30vw, var(--slide-max));
      min-width: 0;
}

.sponsor-card-link {
      text-decoration: none;
      color: inherit;
      display: block;
      height: 100%;
}

.sponsor-card {
      position: relative;
      height: 100%;
      padding: 26px;
      border-radius: var(--radius-xl);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border);
      backdrop-filter: blur(14px);
      box-shadow: var(--shadow-soft);
      display: flex;
      flex-direction: column;
      transform-style: preserve-3d;
      transition:
            transform 280ms var(--ease-out),
            box-shadow 320ms var(--ease-out),
            border-color 280ms var(--ease-out),
            background 280ms var(--ease-out);
      will-change: transform, box-shadow, background;
}

.sponsor-card::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(135deg, rgba(0, 234, 255, 0.55), rgba(59, 130, 246, 0.55), rgba(139, 233, 255, 0.55));
      -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.0;
      transition: opacity 0.3s var(--ease-out);
}

.sponsor-card::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.18) 50%, transparent 100%);
      transform: translateX(-120%) skewX(-12deg);
      opacity: 0;
      pointer-events: none;
}

.sponsor-card:hover {
      transform: translateY(-8px) scale(1.03) rotateX(3deg) rotateY(2deg);
      border-color: var(--card-border-strong);
      box-shadow: var(--shadow-strong);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
}

.sponsor-card:hover::before {
      opacity: 1;
}

.sponsor-card:hover::after {
      opacity: 1;
      animation: sweep 900ms var(--ease-out) forwards;
}

.sponsor-card-link:focus-visible .sponsor-card {
      outline: none;
      box-shadow: var(--ring), var(--shadow-strong);
      transform: translateY(-4px);
}

.sponsor-logo-container {
      height: 110px;
      display: grid;
      place-items: center;
      margin-bottom: 18px;
      perspective: 800px;
}

.sponsor-logo {
      max-width: 160px;
      max-height: 80px;
      object-fit: contain;
      filter: brightness(0.9) contrast(1.05) drop-shadow(0 6px 16px rgba(0, 0, 0, 0.35));
      transform: translateZ(18px);
      transition: transform 300ms var(--ease-out), filter 300ms var(--ease-out);
}

.sponsor-card:hover .sponsor-logo {
      transform: translateZ(28px) scale(1.06);
      filter: brightness(1) drop-shadow(0 10px 24px rgba(0, 234, 255, 0.25));
}

.sponsor-info {
      text-align: center;
      margin-bottom: 12px;
      flex-grow: 1;
}

.sponsor-name {
      font-weight: 800;
      letter-spacing: -0.01em;
      color: var(--primary);
      font-size: clamp(1.05rem, 1.6vw, 1.25rem);
      margin: 2px 0 6px;
      transition: color 220ms var(--ease-out);
}

.sponsor-card:hover .sponsor-name {
      color: #8be9ff;
}

.sponsor-description {
      color: var(--muted);
      font-size: 0.95rem;
      line-height: 1.55;
}

.visit-website {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--primary);
      opacity: 0.85;
      transition: color 200ms var(--ease-out), opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}

.visit-website svg {
      transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out);
      opacity: 0.9;
}

.sponsor-card:hover .visit-website {
      color: #a7f3ff;
      opacity: 1;
      transform: translateY(-1px);
}

.sponsor-card:hover .visit-website svg {
      transform: translateX(3px);
      opacity: 1;
}

@media (max-width: 1200px) {
      .embla__slide {
            flex-basis: clamp(260px, 44vw, 360px);
      }
}

@media (max-width: 768px) {
      .embla__container {
            gap: 16px;
      }

      .embla__slide {
            flex-basis: 100%;
      }

      .sponsor-logo {
            max-width: 130px;
            max-height: 64px;
      }
}

.sponsor-slider[data-theme="light"] {
      --bg-0: #f7fbff;
      --bg-1: #eaf3ff;
      --bg-2: #dcecff;
      --text: #0b1220;
      --muted: #405168;
      --card: rgba(255, 255, 255, 0.8);
      --card-border: rgba(0, 149, 167, 0.18);
      --card-border-strong: rgba(0, 149, 167, 0.35);
}

.sponsor-slider[data-theme="light"] .sponsor-card {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.75));
      box-shadow: 0 12px 36px rgba(13, 42, 76, 0.12);
}

@media (prefers-reduced-: reduce) {
      .sponsor-slider::before {
            animation: none;
      }

      .sponsor-card,
      .sponsor-logo,
      .visit-website {
            transition: none !important;
            animation: none !important;
      }
}

@keyframes auroraMove {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.05); }
      100% { transform: rotate(360deg) scale(1); }
}

@keyframes sweep {
      0% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
      30% { opacity: 1; }
      100% { transform: translateX(120%) skewX(-12deg); opacity: 0; }
}

      `}</style>

      <Container className="sponsor-container">
        <div className="sponsor-header text-center mb-5">
          <div className="tag">
            🤝 PARTNERSHIPS
          </div>

          <h2 className="sponsor-title">Our Sponsors</h2>
          <p className="sponsor-subtitle">
            Proudly supported by industry leaders driving innovation and excellence.
          </p>
        </div>

        {/* Embla Carousel */}
        <div
          className="embla"
          ref={emblaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocusIn}
          onBlur={handleFocusOut}
        >
          <div className="embla__container">
            {sponsors.map((sponsor, index) => (
              <div className="embla__slide" key={sponsor.id}>
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-card-link"
                  aria-label={`Visit ${sponsor.name} website`}
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
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SponsorSlider;