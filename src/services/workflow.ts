
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
        console.warn("API request failed, falling back to mock workflow data");
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
        console.warn("API request failed, falling back to mock workflow data");
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
        console.warn("API request failed, creating mock workflow instead");
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
        console.warn("API request failed, updating mock workflow instead");
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

    try {
      return await this.request<{ success: boolean }>("DELETE", `/workflow/${id}/`);
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, deleting mock workflow instead");
        const index = this.mockData.workflows.findIndex((w) => w.id === id);
        if (index === -1) {
          throw new Error("Workflow not found");
        }
        this.mockData.workflows.splice(index, 1);
        return { success: true };
      }
      throw error;
    }
  }

  async getUserEvents(
    unique = true,
    params: { page?: number; limit?: number } = {}
  ): Promise<EventType[]> {
    const mockEvents = [
      { id: "1", name: "user_signup", description: "User signs up" },
      { id: "2", name: "user_login", description: "User logs in" },
      { id: "3", name: "user_purchase", description: "User makes a purchase" },
    ];

    if (this.mockEnabled) {
      return mockEvents;
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
        console.warn("API request failed, falling back to mock user events");
        return mockEvents;
      }
      throw error;
    }
  }

  async getActionTypes(): Promise<ActionType[]> {
    const mockActionTypes = [
      { id: "1", name: "show_message", description: "Show a message" },
      { id: "2", name: "send_email", description: "Send an email" },
      { id: "3", name: "update_user", description: "Update user profile" },
    ];

    if (this.mockEnabled) {
      return mockActionTypes;
    }

    try {
      return await this.request<ActionType[]>("GET", "/workflow/actions/");
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, falling back to mock action types");
        return mockActionTypes;
      }
      throw error;
    }
  }

  async getTemplates(): Promise<TemplateListType[]> {
    const mockTemplates = [
      { id: "1", name: "Welcome Campaign", description: "Welcome new users" },
      { id: "2", name: "Promotional Campaign", description: "Promote products" },
      { id: "3", name: "Feedback Campaign", description: "Get user feedback" },
    ];

    if (this.mockEnabled) {
      return mockTemplates;
    }

    try {
      return await this.request<TemplateListType[]>("GET", "/messages/templates/");
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, falling back to mock templates");
        return mockTemplates;
      }
      throw error;
    }
  }

  // The remaining methods with mock fallback implementation
  
  async addEvent(event: WebEvent, workflowId: string): Promise<WebEvent> {
    try {
      return await this.request<WebEvent>(
        "POST",
        `/workflow/${workflowId}/events/`,
        event
      );
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, creating mock event instead");
        const mockEvent: WebEvent = {
          ...event,
          id: new Date().getTime().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return mockEvent;
      }
      throw error;
    }
  }

  async updateEvent(
    event: WebEvent,
    workflowId: string,
    eventId: string
  ): Promise<WebEvent> {
    try {
      return await this.request<WebEvent>(
        "PUT",
        `/workflow/${workflowId}/events/${eventId}/`,
        event
      );
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, updating mock event instead");
        return {
          ...event,
          updated_at: new Date().toISOString(),
        };
      }
      throw error;
    }
  }

  async addAction(
    action: Omit<WebAction, "id" | "created_at" | "updated_at">,
    eventId: string,
    workflowId: string
  ): Promise<WebAction> {
    try {
      return await this.request<WebAction>(
        "POST",
        `/workflow/${workflowId}/events/${eventId}/actions/`,
        action
      );
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, creating mock action instead");
        const mockAction: WebAction = {
          id: new Date().getTime().toString(),
          ...action,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return mockAction;
      }
      throw error;
    }
  }

  async updateAction(
    action: WebAction,
    eventId: string,
    workflowId: string
  ): Promise<WebAction> {
    try {
      return await this.request<WebAction>(
        "PUT",
        `/workflow/${workflowId}/events/${eventId}/actions/${action.id}/`,
        action
      );
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, updating mock action instead");
        return {
          ...action,
          updated_at: new Date().toISOString(),
        };
      }
      throw error;
    }
  }

  async deleteAction(
    actionId: string,
    eventId: string,
    workflowId: string
  ): Promise<WebAction> {
    try {
      return await this.request<WebAction>(
        "DELETE",
        `/workflow/${workflowId}/events/${eventId}/actions/${actionId}/`
      );
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, simulating mock action deletion");
        return {
          id: actionId,
          action_type: "deleted",
          action_config: {},
          workflow_event: eventId,
          is_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      throw error;
    }
  }

  async addWebMessage(webMessage: Partial<WebMessage>): Promise<WebMessage> {
    try {
      return await this.request<WebMessage>("POST", `/messages/`, webMessage);
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, creating mock web message instead");
        const mockMessage: WebMessage = {
          id: new Date().getTime().toString(),
          title: webMessage.title || "Mock Message",
          message: webMessage.message || "This is a mock message",
          message_type: webMessage.message_type || "info",
          display_duration: webMessage.display_duration || 5000,
          template_name: webMessage.template_name || "default_template",
          template_config: webMessage.template_config || {},
          position: webMessage.position || "top-right",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return mockMessage;
      }
      throw error;
    }
  }

  async updateWebMessage(webMessage: WebMessage): Promise<WebMessage> {
    try {
      return await this.request<WebMessage>(
        "PUT",
        `/messages/messages/${webMessage.id}/`,
        webMessage
      );
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, updating mock web message instead");
        return {
          ...webMessage,
          updated_at: new Date().toISOString(),
        };
      }
      throw error;
    }
  }

  async deleteWebMessage(webMessageId: string): Promise<void> {
    try {
      return await this.request<void>("DELETE", `/messages/${webMessageId}/`);
    } catch (error) {
      if (this.useMockFallback) {
        console.warn("API request failed, simulating mock message deletion");
        return;
      }
      throw error;
    }
  }
}
