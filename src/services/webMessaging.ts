import { ApiService } from "./api";

export interface WebMessage {
  id: number;
  title: string;
  message: string;
  message_type: "info" | "warning" | "success" | "error";
  display_duration: number;
  template_name: string;
  template_config: Record<string, unknown>;
  workflow: number;
}

export interface TemplateConfig {
  title?: string;
  message?: string;
  cta_text?: string;
  cta_action?: string;
  close_text?: string;
  image_url?: string;
  features?: string[];
  pricing?: {
    amount: number;
    currency: string;
  };
  benefits?: string[];
  end_time?: string;
  urgency_text?: string;
  stock?: {
    remaining: number;
    percentage: number;
  };
  offer_details?: string[];
}

export class WebMessagingService extends ApiService {
  private mockData: { messages: WebMessage[] };

  constructor() {
    super();
    this.mockData = {
      messages: [
        {
          id: 1,
          title: "Welcome to Our Platform",
          message: "Thank you for joining us!",
          message_type: "success",
          display_duration: 5000,
          template_name: "welcome_campaign",
          template_config: {
            cta_text: "Get Started",
            cta_action: 'window.location.href = "/dashboard"',
          },
          workflow: 1,
        },
      ],
    };
  }

  async listMessages(): Promise<WebMessage[]> {
    if (this.mockEnabled) {
      return this.mockData.messages;
    }

    return this.request<WebMessage[]>("GET", "/marketing/web-messages/");
  }

  async getMessage(id: number): Promise<WebMessage> {
    if (this.mockEnabled) {
      const message = this.mockData.messages.find((m) => m.id === id);
      if (!message) {
        throw new Error("Message not found");
      }
      return message;
    }

    return this.request<WebMessage>("GET", `/marketing/web-messages/${id}/`);
  }

  async createMessage(data: Omit<WebMessage, "id">): Promise<WebMessage> {
    if (this.mockEnabled) {
      const newMessage: WebMessage = {
        id: this.mockData.messages.length + 1,
        ...data,
      };
      this.mockData.messages.push(newMessage);
      return newMessage;
    }

    return this.request<WebMessage>("POST", "/marketing/web-messages/", data);
  }

  async updateMessage(
    id: number,
    data: Partial<WebMessage>
  ): Promise<WebMessage> {
    if (this.mockEnabled) {
      const index = this.mockData.messages.findIndex((m) => m.id === id);
      if (index === -1) {
        throw new Error("Message not found");
      }
      this.mockData.messages[index] = {
        ...this.mockData.messages[index],
        ...data,
      };
      return this.mockData.messages[index];
    }

    return this.request<WebMessage>(
      "PUT",
      `/marketing/web-messages/${id}/`,
      data
    );
  }

  async deleteMessage(id: number): Promise<{ success: boolean }> {
    if (this.mockEnabled) {
      const index = this.mockData.messages.findIndex((m) => m.id === id);
      if (index === -1) {
        throw new Error("Message not found");
      }
      this.mockData.messages.splice(index, 1);
      return { success: true };
    }

    return this.request<{ success: boolean }>(
      "DELETE",
      `/marketing/web-messages/${id}/`
    );
  }

  async getTemplateConfig(templateName: string): Promise<TemplateConfig> {
    if (this.mockEnabled) {
      return {
        title: "Default Title",
        message: "Default Message",
        cta_text: "Click Here",
        cta_action: 'console.log("CTA clicked")',
        close_text: "Close",
      };
    }

    return this.request<TemplateConfig>(
      "GET",
      `/marketing/templates/${templateName}/`
    );
  }
}
