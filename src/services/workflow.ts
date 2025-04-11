import { mockWorkflows } from "@/mock/workflow";
import { ApiService } from "./api";
import {
  ActionType,
  EventType,
  JsonWorkflow,
  TemplateListType,
  WebAction,
  WebEvent,
  WebMessage,
} from "@/types/workflow";

export class WorkflowService extends ApiService {
  private mockData: { workflows: JsonWorkflow[] };

  constructor() {
    super();
    this.mockData = {
      workflows: [...mockWorkflows],
    };
  }

  async listWorkflows(): Promise<JsonWorkflow[]> {
    if (this.mockEnabled) {
      console.log("Using mock workflows:", this.mockData.workflows);
      return this.mockData.workflows;
    }

    try {
      return await this.request<JsonWorkflow[]>("GET", "/workflow/");
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("Falling back to mock workflow data");
        return this.mockData.workflows;
      }
      throw error;
    }
  }

  async getWorkflow(id: number | string): Promise<JsonWorkflow> {
    if (this.mockEnabled) {
      const workflow = this.mockData.workflows.find((w) => w.id === id);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      return workflow;
    }

    try {
      return await this.request<JsonWorkflow>("GET", `/workflow/${id}/`);
    } catch (error) {
      if (this.useMockFallback) {
        const workflow = this.mockData.workflows.find((w) => w.id === id);
        if (!workflow) {
          throw new Error("Workflow not found");
        }
        return workflow;
      }
      throw error;
    }
  }

  async createWorkflow(
    workflow: Omit<JsonWorkflow, "id" | "created_at" | "updated_at">
  ): Promise<JsonWorkflow> {
    if (this.mockEnabled) {
      const newWorkflow: JsonWorkflow = {
        id: (this.mockData.workflows.length + 1).toString(),
        ...workflow,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.mockData.workflows.push(newWorkflow);
      return newWorkflow;
    }

    try {
      return await this.request<JsonWorkflow>("POST", "/workflow/", workflow);
    } catch (error) {
      if (this.useMockFallback) {
        const newWorkflow: JsonWorkflow = {
          id: (this.mockData.workflows.length + 1).toString(),
          ...workflow,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        this.mockData.workflows.push(newWorkflow);
        return newWorkflow;
      }
      throw error;
    }
  }

  async updateWorkflow(
    id: string,
    workflow: Partial<JsonWorkflow>
  ): Promise<JsonWorkflow> {
    if (this.mockEnabled) {
      const index = this.mockData.workflows.findIndex((w) => w.id === id);
      if (index === -1) {
        throw new Error("Workflow not found");
      }
      this.mockData.workflows[index] = {
        ...this.mockData.workflows[index],
        ...workflow,
        updated_at: new Date().toISOString(),
      };
      return this.mockData.workflows[index];
    }

    try {
      return await this.request<JsonWorkflow>("PUT", `/workflow/${id}/`, workflow);
    } catch (error) {
      if (this.useMockFallback) {
        const index = this.mockData.workflows.findIndex((w) => w.id === id);
        if (index === -1) {
          throw new Error("Workflow not found");
        }
        this.mockData.workflows[index] = {
          ...this.mockData.workflows[index],
          ...workflow,
          updated_at: new Date().toISOString(),
        };
        return this.mockData.workflows[index];
      }
      throw error;
    }
  }

  async deleteWorkflow(id: string): Promise<{ success: boolean }> {
    if (this.mockEnabled) {
      const index = this.mockData.workflows.findIndex((w) => w.id === id);
      if (index === -1) {
        throw new Error("Workflow not found");
      }
      this.mockData.workflows.splice(index, 1);
      return { success: true };
    }

    return this.request<{ success: boolean }>("DELETE", `/workflow/${id}/`);
  }

  async getUserEvents(
    unique = true,
    params: { page?: number; limit?: number } = {}
  ): Promise<EventType[]> {
    if (this.mockEnabled) {
      return [
        { id: "1", name: "user_signup", description: "User signs up" },
        { id: "2", name: "user_login", description: "User logs in" },
        { id: "3", name: "user_purchase", description: "User makes a purchase" },
      ];
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await this.request<any[]>(
        "GET",
        `/user-events/events/list/?unique_type=${unique}`,
        params
      ).then((res) =>
        res.map((event) => ({
          id: event.id,
          name: event.event_type,
          description: event.event_data?.type,
          created_at: event.created_at,
        }))
      );
    } catch (error) {
      if (this.useMockFallback) {
        return [
          { id: "1", name: "user_signup", description: "User signs up" },
          { id: "2", name: "user_login", description: "User logs in" },
          { id: "3", name: "user_purchase", description: "User makes a purchase" },
        ];
      }
      throw error;
    }
  }

  async getActionTypes(): Promise<ActionType[]> {
    if (this.mockEnabled) {
      return [
        { id: "1", name: "show_message", description: "Show a message" },
        { id: "2", name: "send_email", description: "Send an email" },
        { id: "3", name: "update_user", description: "Update user profile" },
      ];
    }

    try {
      return await this.request<ActionType[]>("GET", "/workflow/actions/");
    } catch (error) {
      if (this.useMockFallback) {
        return [
          { id: "1", name: "show_message", description: "Show a message" },
          { id: "2", name: "send_email", description: "Send an email" },
          { id: "3", name: "update_user", description: "Update user profile" },
        ];
      }
      throw error;
    }
  }

  async getTemplates(): Promise<TemplateListType[]> {
    if (this.mockEnabled) {
      return [
        { id: "1", name: "Welcome Campaign", description: "Welcome new users" },
        { id: "2", name: "Promotional Campaign", description: "Promote products" },
        { id: "3", name: "Feedback Campaign", description: "Get user feedback" },
      ];
    }

    try {
      return await this.request<TemplateListType[]>("GET", "/messages/templates/");
    } catch (error) {
      if (this.useMockFallback) {
        return [
          { id: "1", name: "Welcome Campaign", description: "Welcome new users" },
          { id: "2", name: "Promotional Campaign", description: "Promote products" },
          { id: "3", name: "Feedback Campaign", description: "Get user feedback" },
        ];
      }
      throw error;
    }
  }

  async addEvent(event: WebEvent, workflowId: string): Promise<WebEvent> {
    return this.request<WebEvent>(
      "POST",
      `/workflow/${workflowId}/events/`,
      event
    );
  }

  async updateEvent(
    event: WebEvent,
    workflowId: string,
    eventId: string
  ): Promise<WebEvent> {
    return this.request<WebEvent>(
      "PUT",
      `/workflow/${workflowId}/events/${eventId}/`,
      event
    );
  }

  async addAction(
    action: Omit<WebAction, "id" | "created_at" | "updated_at">,
    eventId: string,
    workflowId: string
  ): Promise<WebAction> {
    return this.request<WebAction>(
      "POST",
      `/workflow/${workflowId}/events/${eventId}/actions/`,
      action
    );
  }

  async updateAction(
    action: WebAction,
    eventId: string,
    workflowId: string
  ): Promise<WebAction> {
    return this.request<WebAction>(
      "PUT",
      `/workflow/${workflowId}/events/${eventId}/actions/${action.id}/`,
      action
    );
  }

  async deleteAction(
    actionId: string,
    eventId: string,
    workflowId: string
  ): Promise<WebAction> {
    return this.request<WebAction>(
      "DELETE",
      `/workflow/${workflowId}/events/${eventId}/actions/${actionId}/`
    );
  }

  async addWebMessage(webMessage: Partial<WebMessage>): Promise<WebMessage> {
    return this.request<WebMessage>("POST", `/messages/`, webMessage);
  }

  async updateWebMessage(webMessage: WebMessage): Promise<WebMessage> {
    return this.request<WebMessage>(
      "PUT",
      `/messages/messages/${webMessage.id}/`,
      webMessage
    );
  }

  async deleteWebMessage(webMessageId: string): Promise<void> {
    return this.request<void>("DELETE", `/messages/${webMessageId}/`);
  }
}
