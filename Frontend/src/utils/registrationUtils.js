// Registration utility functions for VEYG-2025
import cookieAuth from './cookieAuth'

/**
 * Register team and handle PDF download
 * @param {Object} payload - Registration data
 * @returns {Promise<Object>} Registration response
 */
export async function registerTeam(payload) {
  try {
    const authData = cookieAuth.getAuthData()
    if (!authData || !authData.token) {
      throw new Error('Please log in to register for games.')
    }

    const res = await fetch("/api/game-registrations/my-registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authData.token}`
      },
      body: JSON.stringify(payload)
    });

    // Check if response is HTML (error page) instead of JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response received:', text);
      throw new Error(`Server returned invalid response (${res.status}). Please try again.`);
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      throw new Error('Server returned invalid JSON response. Please try again.');
    }

    if (!res.ok) throw new Error(data.message || "Registration failed");

    // If server returned registration with PDF path, trigger download
    if (data.registration?.pdfPath) {
      const pdfFilename = data.registration.pdfPath.split('/').pop();
      const downloadUrl = `/receipts/${pdfFilename}`;

      // Try multiple download methods for mobile compatibility
      await downloadPdfFromUrl(downloadUrl, `Registration_${data.registration.registrationId}.pdf`);
    }

    // Show success message
    showSuccessMessage("Registration successful! Emails sent to all participants. PDF downloaded.");
    return data;
  } catch (err) {
    console.error("Registration error:", err);
    showErrorMessage("Registration failed: " + (err.message || err));
    throw err;
  }
}

/**
 * Download PDF from URL with mobile fallbacks
 * @param {string} url - PDF URL
 * @param {string} filename - Desired filename
 */
async function downloadPdfFromUrl(url, filename) {
  try {
    // Method 1: Direct download link (works on most devices)
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Method 2: Fallback for mobile - open in new tab
    setTimeout(() => {
      window.open(url, "_blank");
    }, 500);

  } catch (err) {
    console.error("PDF download error:", err);
    // Final fallback - just open the URL
    window.open(url, "_blank");
  }
}

/**
 * Download PDF from Base64 data
 * @param {string} base64 - Base64 PDF data
 * @param {string} filename - Desired filename
 */
export function downloadBase64Pdf(base64, filename) {
  try {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Base64 PDF download error:", err);
    showErrorMessage("Failed to download PDF");
  }
}

/**
 * Setup backend health monitoring to replace popup alerts
 */
export function setupBackendMonitor() {
  const check = async () => {
    try {
      const resp = await fetch("/api/health", {
        method: "GET",
        timeout: 5000
      });
      if (!resp.ok) throw new Error("Backend unhealthy");

      // Backend OK -> hide any alerts
      hideBackendAlert();
      console.log("✅ Backend health check passed");
    } catch (err) {
      console.warn("⚠️ Backend health check failed:", err);
      showBackendAlert("Backend server connection failed. Some features may not work properly.");
    }
  };

  // Run once after a short delay (no blind 2-3s popup)
  setTimeout(check, 5000);

  // Poll less frequently to reduce performance impact
  setInterval(check, 1000 * 60 * 10); // every 10 minutes
}

/**
 * Show backend connection alert
 * @param {string} msg - Alert message
 */
function showBackendAlert(msg) {
  console.warn("Backend Alert:", msg);

  // Try to find existing alert element
  let alertElement = document.getElementById("backend-alert");

  if (!alertElement) {
    // Create alert element if it doesn't exist
    alertElement = document.createElement("div");
    alertElement.id = "backend-alert";
    alertElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 12px 20px;
      border-radius: 5px;
      z-index: 9999;
      max-width: 300px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;
    document.body.appendChild(alertElement);
  }

  alertElement.innerText = msg;
  alertElement.style.display = "block";
}

/**
 * Hide backend connection alert
 */
function hideBackendAlert() {
  const alertElement = document.getElementById("backend-alert");
  if (alertElement) {
    alertElement.style.display = "none";
  }
}

/**
 * Show success message
 * @param {string} msg - Success message
 */
function showSuccessMessage(msg) {
  // You can integrate this with your existing notification system
  console.log("✅ Success:", msg);

  // Simple toast notification
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #4CAF50;
    color: white;
    padding: 12px 24px;
    border-radius: 5px;
    z-index: 9999;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  toast.innerText = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

/**
 * Show error message
 * @param {string} msg - Error message
 */
function showErrorMessage(msg) {
  console.error("❌ Error:", msg);

  // Simple error toast
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #f44336;
    color: white;
    padding: 12px 24px;
    border-radius: 5px;
    z-index: 9999;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  toast.innerText = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Initialize backend monitoring when module loads
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => setupBackendMonitor());
}
