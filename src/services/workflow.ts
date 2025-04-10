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
      return this.mockData.workflows;
    }

    return this.request<JsonWorkflow[]>("GET", "/workflow/");
  }

  async getWorkflow(id: number | string): Promise<JsonWorkflow> {
    if (this.mockEnabled) {
      const workflow = this.mockData.workflows.find((w) => w.id === id);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      return workflow;
    }

    return this.request<JsonWorkflow>("GET", `/workflow/${id}/`);
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

    return this.request<JsonWorkflow>("POST", "/workflow/", workflow);
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
      };
      return this.mockData.workflows[index];
    }

    return this.request<JsonWorkflow>("PUT", `/workflow/${id}/`, workflow);
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

  async getUserEvents(unique = true): Promise<EventType[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any[]>(
      "GET",
      `/user-events/events/list/?unique_type=${unique}`
    ).then((res) =>
      res.map((event) => ({
        id: event.id,
        name: event.event_type,
        description: event.event_data?.type,
        created_at: event.created_at,
      }))
    );
  }

  async getActionTypes(): Promise<ActionType[]> {
    return this.request<ActionType[]>("GET", "/workflow/actions/");
  }

  async getTemplates(): Promise<TemplateListType[]> {
    return this.request<TemplateListType[]>("GET", "/messages/templates/");
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
