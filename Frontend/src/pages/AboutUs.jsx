import { Container, Row, Col } from "react-bootstrap"
import { Lightbulb, Users, Award, Zap, Code, Trophy, Target, Rocket } from 'lucide-react'
import PageHeroSection from "../components/HeroSection/PageHeroSection"

const AboutUs = () => {
  return (
    <>
      <PageHeroSection
        title="About VEYG 2K25"
        subtitle="Your Ultimate Technical Competition Platform"
        icon={Zap}
        description="Empowering students through innovative technical competitions and fostering excellence in technology and programming skills."
      />

      {/* Main Content */}
      <div className="about-content-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Mission Statement */}
              <div className="mission-card">
                <div className="card-header">
                  <Target size={24} />
                  <h2>Our Mission</h2>
                </div>
                <div className="card-content">
                  <p className="mission-text">
                    VEYG - 2K25 is dedicated to fostering innovation, competition, and community among tech enthusiasts and
                    gamers. We bring together the brightest minds and most passionate players to challenge their skills,
                    showcase their talents, and connect with like-minded individuals in the ever-evolving world of technology.
                  </p>
                </div>
              </div>

              {/* Core Values */}
              <div className="values-section">
                <div className="section-header">
                  <h2>Core Values</h2>
                  <p>The principles that drive our technical community</p>
                </div>

                <div className="values-grid">
                  <div className="value-card">
                    <div className="value-icon">
                      <Lightbulb size={32} />
                    </div>
                    <div className="value-content">
                      <h3>Innovation</h3>
                      <p>We encourage participants to push boundaries and develop groundbreaking solutions in various technical domains, from AI to blockchain.</p>
                    </div>
                  </div>

                  <div className="value-card">
                    <div className="value-icon">
                      <Users size={32} />
                    </div>
                    <div className="value-content">
                      <h3>Community</h3>
                      <p>Our platform is a hub for networking, collaboration, and building lasting connections within the global tech and gaming ecosystem.</p>
                    </div>
                  </div>

                  <div className="value-card">
                    <div className="value-icon">
                      <Award size={32} />
                    </div>
                    <div className="value-content">
                      <h3>Excellence</h3>
                      <p>We strive to provide a fair and challenging environment where technical talent is recognized, celebrated, and rewarded.</p>
                    </div>
                  </div>

                  <div className="value-card">
                    <div className="value-icon">
                      <Code size={32} />
                    </div>
                    <div className="value-content">
                      <h3>Technical Mastery</h3>
                      <p>We promote deep technical understanding and practical application across multiple programming languages and frameworks.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision Section */}
              <div className="vision-card">
                <div className="card-header">
                  <Rocket size={24} />
                  <h2>Our Vision</h2>
                </div>
                <div className="card-content">
                  <p className="vision-text">
                    To be the leading platform for technical competitions worldwide, inspiring the next generation of
                    innovators and fostering a vibrant global community that shapes the future of technology.
                  </p>
                </div>
              </div>

              {/* Team Section */}
              <div className="team-section">
                <div className="section-header">
                  <h2>Our Team</h2>
                  <p>Meet the people behind VEYG 2K25</p>
                </div>

                {/* Coordinators */}
                <div className="team-category">
                  <h3 className="team-category-title">Event Coordinators</h3>
                  <div className="team-grid">
                    <div className="team-card">
                      <div className="team-member-avatar">
                        <img src="https://www.saffrony.ac.in/media/4258/kunal-sir.jpg" alt="Prof. Kunalsinh Kathia" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </div>
                      <div className="team-member-info">
                        <h4>Prof. Kunalsinh Kathia</h4>
                        <p className="team-member-role">Faculty Coordinator</p>
                        <p className="team-member-dept">Mechnaical Department</p>
                      </div>
                    </div>

                    <div className="team-card">
                      <div className="team-member-avatar">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFa8i8irJYNO0OCUsUiydH3Tcq0q0yMVH3wg&s" alt="Prof. Yogesh Kakadiya" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </div>
                      <div className="team-member-info">
                        <h4>Prof. Mitul Patel</h4>
                        <p className="team-member-role">Technical Coordinator</p>
                        <p className="team-member-dept">Electrical Department</p>
                      </div>
                    </div>

                    <div className="team-card">
                      <div className="team-member-avatar">
                        <img src="https://media.licdn.com/dms/image/v2/C4D03AQEPhAA4SQYmeQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1663781191017?e=1759363200&v=beta&t=buB1_gxyXaMjg8rr7M72TFIXsmGfhcP_VEMH2vuj02o" alt="Prof. Twinkle Verma" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </div>
                      <div className="team-member-info">
                        <h4>Prof. Twinkle Verma</h4>
                        <p className="team-member-role">Event Coordinator</p>
                        <p className="team-member-dept">Computer Engineering Department</p>
                      </div>
                    </div>

                    <div className="team-card">
                      <div className="team-member-avatar">
                        <img src="https://media.licdn.com/dms/image/v2/D4D03AQFEMM-wkBAz9g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1694598648255?e=2147483647&v=beta&t=8SaIe57cXIeCjfFlB9LgP65Lv_E2ZypsjFn4lJXzZ7U" alt="Prof. Nainsi Soni" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      </div>
                      <div className="team-member-info">
                        <h4>Prof. Nainsi Soni</h4>
                        <p className="team-member-role">Event Coordinator</p>
                        <p className="team-member-dept">Computer Engineering Department</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Development Team */}
                <div className="team-category">
                  <h3 className="team-category-title">Development Team</h3>
                  <div className="team-grid">
                    <div className="team-card">
                      <div className="team-member-info">
                        <h4>Fenil Khatri</h4>
                      </div>
                    </div>

                    <div className="team-card">
                      <div className="team-member-info">
                        <h4>Divyesh Khubavat</h4>
                      </div>
                    </div>

                    <div className="team-card">
                      <div className="team-member-info">
                        <h4>Vraj Fadiya</h4>
                      </div>
                    </div>

                    <div className="team-card">
                      <div className="team-member-info">
                        <h4>Riddhi Sadhu</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{`
        .about-hero-section {
          position: relative;
          height: 100vh;
          background: linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0;
          overflow: hidden;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(0, 123, 255, 0.1) 0%, transparent 50%);
        }
        
        .hero-content {
          position: relative;
          text-align: center;
          z-index: 2;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 212, 255, 0.2);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          color: white;
          margin-bottom: 15px;
          background: linear-gradient(45deg, #00d4ff, #007bff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }
        
        .about-content-section {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          min-height: 100vh;
          padding: 80px 0;
        }
        
        .mission-card, .vision-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          margin-bottom: 50px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .mission-card:hover, .vision-card:hover {
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 30px 30px 0;
          color: #00d4ff;
        }
        
        .card-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }
        
        .card-content {
          padding: 20px 30px 30px;
        }
        
        .mission-text, .vision-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          line-height: 1.8;
          margin: 0;
        }
        
        .values-section {
          margin: 60px 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #00d4ff, #007bff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .section-header p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
          margin: 0;
        }
        
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }
        
        .value-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 30px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .value-card:hover {
          border-color: rgba(0, 212, 255, 0.3);
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 212, 255, 0.1);
        }
        
        .value-icon {
          background: linear-gradient(45deg, #007bff, #00d4ff);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 20px;
        }
        
        .value-content h3 {
          color: white;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        
        .value-content p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
        }
        
        .stats-section {
          margin-top: 60px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
        }
        
        .stat-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .stat-item:hover {
          border-color: rgba(0, 212, 255, 0.3);
          transform: translateY(-3px);
        }
        
        .stat-item svg {
          color: #00d4ff;
          margin-bottom: 15px;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }
        
        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.8rem;
          }
          
          .values-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .card-header, .card-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
        
        .team-section {
          margin: 60px 0;
        }
        
        .team-category {
          margin-bottom: 50px;
        }
        
        .team-category-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.3);
          display: inline-block;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }
        
        @media (max-width: 1200px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        .team-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 25px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .team-card:hover {
          border-color: rgba(0, 212, 255, 0.3);
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 212, 255, 0.1);
        }
        
        .team-member-avatar {
          background: linear-gradient(45deg, #007bff, #00d4ff);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .team-member-info {
          flex-grow: 1;
        }
        
        .team-member-info h4 {
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .team-member-role {
          color: #00d4ff;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .team-member-dept {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}

export default AboutUs;