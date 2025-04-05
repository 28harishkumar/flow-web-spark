import { ApiService } from "./api";

export interface UserEvent {
  id: number;
  external_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export class UserEventsService extends ApiService {
  private mockData: { events: UserEvent[] };

  constructor() {
    super();
    this.mockData = {
      events: [],
    };
  }

  async trackEvent(
    externalId: string,
    eventType: string,
    eventData: Record<string, unknown> = {}
  ): Promise<UserEvent> {
    const data = {
      external_id: externalId,
      event_type: eventType,
      event_data: eventData,
    };

    if (this.mockEnabled) {
      const event: UserEvent = {
        id: this.mockData.events.length + 1,
        ...data,
        created_at: new Date().toISOString(),
      };
      this.mockData.events.push(event);
      return event;
    }

    return this.request<UserEvent>("POST", "/marketing/user-events/", data);
  }

  async getUserEvents(
    externalId: string,
    params: { start_date?: string; end_date?: string } = {}
  ): Promise<UserEvent[]> {
    if (this.mockEnabled) {
      return this.mockData.events.filter((e) => e.external_id === externalId);
    }

    return this.request<UserEvent[]>(
      "GET",
      `/marketing/user-events/${externalId}/`,
      { params }
    );
  }

  async getEventTypes(): Promise<string[]> {
    if (this.mockEnabled) {
      return [
        "user_signup",
        "cart_abandoned",
        "purchase_completed",
        "page_view",
        "button_click",
      ];
    }

    return this.request<string[]>("GET", "/marketing/user-events/types/");
  }
}
