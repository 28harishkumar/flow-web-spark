import { mockWorkflows } from "@/mock/workflow";
import { ApiService } from "./api";
import { JsonWorkflow } from "@/types/workflow";

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
    data: Omit<JsonWorkflow, "id" | "created_at" | "updated_at">
  ): Promise<JsonWorkflow> {
    if (this.mockEnabled) {
      const newWorkflow: JsonWorkflow = {
        id: (this.mockData.workflows.length + 1).toString(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.mockData.workflows.push(newWorkflow);
      return newWorkflow;
    }

    return this.request<JsonWorkflow>("POST", "/workflow/", data);
  }

  async updateWorkflow(
    id: string,
    data: Partial<JsonWorkflow>
  ): Promise<JsonWorkflow> {
    if (this.mockEnabled) {
      const index = this.mockData.workflows.findIndex((w) => w.id === id);
      if (index === -1) {
        throw new Error("Workflow not found");
      }
      this.mockData.workflows[index] = {
        ...this.mockData.workflows[index],
        ...data,
      };
      return this.mockData.workflows[index];
    }

    return this.request<JsonWorkflow>("PUT", `/workflow/${id}/`, data);
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
}
