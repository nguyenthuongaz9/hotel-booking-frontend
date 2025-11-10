import axios from "axios";

class KeycloakService {
  constructor() {
    this.config = {
      url: "http://localhost:8181",
      realm: "hotelbooking",
      clientId: "api-gateway",
      clientSecret: "api-gateway-secret",
    };
    this.token = null;
    this.tokenExpiry = null;
  }

  async getClientToken() {
    try {
      if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.token;
      }

      console.log("🔑 Requesting new token from Keycloak...");

      const response = await axios.post(
        `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 10000,
        },
      );

      const { access_token, expires_in } = response.data;

      this.token = access_token;
      this.tokenExpiry = Date.now() + expires_in * 1000 - 60000;
      console.log("✅ Token received successfully");
      return access_token;
    } catch (error) {
      console.error(
        "❌ Failed to get token:",
        error.response?.data || error.message,
      );
      throw new Error(
        `Token request failed: ${error.response?.data?.error_description || error.message}`,
      );
    }
  }

  async getUserToken(username, password) {
    try {
      const response = await axios.post(
        `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: "password",
          username: username,
          password: password,
          scope: "openid",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(
        `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Refresh token failed:", error.response?.data);
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const response = await axios.post(
        `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token/introspect`,
        new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          token: token,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw error;
    }
  }

  async logout(refreshToken) {
    try {
      await axios.post(
        `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/logout`,
        new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  clearToken() {
    this.token = null;
    this.tokenExpiry = null;
  }
}

export default new KeycloakService();
