class MarketingClient {
  constructor({ apiKey, baseUrl = "http://localhost:8000/api" }) {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.storage = window.localStorage;
    this.currentUser = null;
    this.workflows = [];
    this.lastWorkflowFetch = null;
    this.currentPopup = null;
  }

  /**
   * Initialize the SDK with user information
   * @param {Object} userInfo - User information
   * @param {string} userInfo.externalId - External ID of the user
   * @param {Object} userInfo.attributes - Additional user attributes
   * @returns {Promise<Object>} - User object
   */
  async init({ externalId, attributes = {} }) {
    if (!externalId) {
      throw new Error("External ID is required");
    }

    try {
      const response = await this._makeRequest("POST", "/client-users/", {
        external_id: externalId,
        ...attributes,
      });

      console.log(" /client-users/ response", response);

      this.currentUser = response;
      await this.fetchWorkflows();

      return this.currentUser;
    } catch (error) {
      console.error("Failed to initialize Tacking client:", error);
      throw error;
    }
  }

  /**
   * Track a user event
   * @param {string} eventType - Type of the event
   * @param {Object} eventData - Additional event data
   * @returns {Promise<Object>} - Event object with triggered messages
   */
  async trackEvent(eventType, eventData = {}) {
    if (!this.currentUser) {
      throw new Error("Tracking client not initialized. Call init() first.");
    }

    try {
      const response = await this._makeRequest("POST", "/user-events/events/", {
        external_id: this.currentUser.external_id,
        event_type: eventType,
        event_data: eventData,
        category: "web",
      });

      if (response.messages && response.messages.length > 0) {
        this.workflows = response.workflows;
        this._updateWorkflowsInStorage();
        await this._showMessages(response.messages);
      }

      return response;
    } catch (error) {
      console.error("Failed to track event:", error);
      throw error;
    }
  }

  /**
   * Fetch workflows for the current user
   * @returns {Promise<Array>} - Array of workflow objects
   */
  async fetchWorkflows() {
    if (!this.currentUser) {
      throw new Error("Tracking client not initialized. Call init() first.");
    }

    const now = Date.now();
    if (this.lastWorkflowFetch && now - this.lastWorkflowFetch < 300000) {
      return this.getWorkflows();
    }

    try {
      const response = await this._makeRequest(
        "GET",
        `/workflow/user/${this.currentUser.external_id}/`
      );

      this.workflows = response;
      this.lastWorkflowFetch = now;
      this._updateWorkflowsInStorage();

      return this.workflows;
    } catch (error) {
      console.error("Failed to fetch workflows:", error);
      throw error;
    }
  }

  /**
   * Get all active workflows from local storage
   * @returns {Array} - Array of workflow objects
   */
  getWorkflows() {
    const stored = this.storage.getItem("tracking_workflows");
    return stored ? JSON.parse(stored) : [];
  }

  closePopup() {
    if (this.currentPopup) {
      document.body.removeChild(this.currentPopup);
      this.currentPopup = null;
    }
  }

  async _showMessages(messages) {
    for (const message of messages) {
      if (!message.is_active) continue;
      const url = `${this.baseUrl}/messages/templates/${message.web_message.id}/`;

      try {
        const response = await fetch(url);
        const template = await response.text();

        this._showPopup(url, template, message);

        // if (message.display_duration > 0) {
        //   setTimeout(() => this.closePopup(), message.display_duration);
        // }
      } catch (error) {
        console.error("Failed to show message:", error);
      }
    }
  }

  _showPopup(url, template, message) {
    this.closePopup(); // Close any existing popup
    const iframe = document.getElementById("message-popup");
    if (iframe) {
      document.body.removeChild(iframe);
    }

    const popupContainer = document.createElement("div");
    // popupContainer.innerHTML = template;
    popupContainer.innerHTML = template;
    popupContainer.style.position = "fixed";
    popupContainer.style.top = "0";
    popupContainer.style.left = "0";
    popupContainer.style.width = "100%";
    popupContainer.style.height = "100%";
    popupContainer.style.border = "none";
    popupContainer.id = "message-popup";
    popupContainer.style.zIndex = "1000";
    MarketingClient.closePopup = this.closePopup.bind(this);

    this.currentPopup = popupContainer;
    // document.body.appendChild(this.currentPopup);
    document.body.appendChild(popupContainer);
  }

  _updateWorkflowsInStorage() {
    this.storage.setItem("tracking_workflows", JSON.stringify(this.workflows));
  }

  /**
   * Make an HTTP request to the API
   * @private
   */
  async _makeRequest(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "X-API-KEY": this.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    };

    const options = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || "Request failed");
    }

    return responseData;
  }
}

// Export for different module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = MarketingClient;
} else if (typeof define === "function" && define.amd) {
  define([], () => MarketingClient);
} else {
  window.MarketingClient = MarketingClient;
}
