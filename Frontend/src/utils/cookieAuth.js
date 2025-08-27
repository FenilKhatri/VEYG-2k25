// Cookie-based authentication utility
class CookieAuth {
  // Set a cookie with expiration
  setCookie(name, value, days = 30) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${window.location.protocol === 'https:'}`;
  }

  // Get a cookie value
  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Delete a cookie
  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Set authentication data
  setAuthData(authData) {
    this.setCookie('auth_token', authData.token, 30);
    this.setCookie('user_id', authData.userId, 30);
    this.setCookie('user_name', authData.userName, 30);
    this.setCookie('user_role', authData.userRole, 30);
    this.setCookie('is_admin', authData.isAdmin.toString(), 30);
  }

  // Get authentication data
  getAuthData() {
    const token = this.getCookie('auth_token');
    const userId = this.getCookie('user_id');
    const userName = this.getCookie('user_name');
    const userRole = this.getCookie('user_role');
    const isAdmin = this.getCookie('is_admin') === 'true';

    if (!token || !userId || !userName) {
      return null;
    }

    return {
      token,
      userId,
      userName,
      userRole,
      isAdmin
    };
  }

  // Clear all authentication data
  clearAuthData() {
    this.deleteCookie('auth_token');
    this.deleteCookie('user_id');
    this.deleteCookie('user_name');
    this.deleteCookie('user_role');
    this.deleteCookie('is_admin');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const authData = this.getAuthData();
    return authData !== null;
  }

  // Get current user info
  getCurrentUser() {
    const authData = this.getAuthData();
    if (!authData) return null;

    return {
      id: authData.userId,
      username: authData.userName,
      name: authData.userName,
      role: authData.userRole,
      isAdmin: authData.isAdmin
    };
  }
}

export default new CookieAuth();
