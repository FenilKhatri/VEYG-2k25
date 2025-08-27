import React from 'react'
import { CheckCircle, AlertTriangle, Info, X, Zap } from 'lucide-react'

const Toast = ({ show, message, type, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />
      case "error":
        return <AlertTriangle size={20} />
      case "info":
        return <Info size={20} />
      default:
        return <CheckCircle size={20} />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)",
          border: "1px solid rgba(0, 255, 136, 0.3)",
          shadow: "0 8px 32px rgba(0, 255, 136, 0.2)"
        }
      case "error":
        return {
          bg: "linear-gradient(135deg, #ff4757 0%, #ff3742 100%)",
          border: "1px solid rgba(255, 71, 87, 0.3)",
          shadow: "0 8px 32px rgba(255, 71, 87, 0.2)"
        }
      case "info":
        return {
          bg: "linear-gradient(135deg, #00d4ff 0%, #007bff 100%)",
          border: "1px solid rgba(0, 212, 255, 0.3)",
          shadow: "0 8px 32px rgba(0, 212, 255, 0.2)"
        }
      default:
        return {
          bg: "linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)",
          border: "1px solid rgba(0, 255, 136, 0.3)",
          shadow: "0 8px 32px rgba(0, 255, 136, 0.2)"
        }
    }
  }

  if (!show) return null

  const styles = getStyles(type)

  return (
    <>
      <div className="tech-toast-container">
        <div className="tech-toast" style={{
          background: styles.bg,
          border: styles.border,
          boxShadow: styles.shadow
        }}>
          <div className="toast-content">
            <div className="toast-icon">
              {getIcon(type)}
            </div>
            <div className="toast-message">
              {message}
            </div>
            <button className="toast-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
          <div className="toast-progress"></div>
        </div>
      </div>

      <style>{`
        .tech-toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          pointer-events: none;
        }

        .tech-toast {
          pointer-events: all;
          min-width: 320px;
          max-width: 400px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          animation: slideInRight 0.3s ease-out;
          position: relative;
          overflow: hidden;
        }

        .toast-content {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          gap: 12px;
          color: white;
        }

        .toast-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .toast-message {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
        }

        .toast-close {
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toast-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.8);
          animation: progressBar 3s linear;
          border-radius: 0 0 12px 12px;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @media (max-width: 480px) {
          .tech-toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
          }
          
          .tech-toast {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}

export default Toast
