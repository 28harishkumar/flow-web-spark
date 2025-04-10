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
}
