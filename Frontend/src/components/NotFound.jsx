import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
        color: '#e2e8f0',
        padding: '20px'
      }}
    >
      <Container className="text-center">
        <div className="mb-4">
          <img 
            src="/src/public/404 not found.png" 
            alt="404 Not Found" 
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '400px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0, 234, 255, 0.2)'
            }}
          />
        </div>
        
        <h1 
          className="mb-3"
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00eaff, #ff00e5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(0, 234, 255, 0.5)'
          }}
        >
          404
        </h1>
        
        <h2 className="mb-4" style={{ color: '#94a3b8', fontSize: '1.5rem' }}>
          Page Not Found
        </h2>
        
        <p className="mb-4" style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to the action!
        </p>
        
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Button
            as={Link}
            to="/"
            size="lg"
            style={{
              background: 'linear-gradient(45deg, #00eaff, #007bff)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 30px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0, 234, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 234, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 234, 255, 0.3)';
            }}
          >
            <Home size={20} className="me-2" />
            Go Home
          </Button>
          
          <Button
            variant="outline-light"
            size="lg"
            onClick={() => window.history.back()}
            style={{
              borderColor: '#64748b',
              color: '#94a3b8',
              borderRadius: '12px',
              padding: '12px 30px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#00eaff';
              e.target.style.color = '#00eaff';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#64748b';
              e.target.style.color = '#94a3b8';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <ArrowLeft size={20} className="me-2" />
            Go Back
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
