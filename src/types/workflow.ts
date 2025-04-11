import { MarkerType } from "@xyflow/react";

export interface Node {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    description?: string;
    type: string;
    properties: Record<string, any>;
    eventProperties?: Record<string, any>;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  markerEnd?: {
    type: MarkerType;
  };
}

export interface ThemeConfig {
  background: string;
  text: string;
  primary: string;
  secondary: string;
}

export interface TemplateConfig {
  title?: string;
  message?: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  rating_options?: Array<{
    value: number;
    label: string;
  }>;
  onRatingSelect?: (value: number) => void;
  show_comment_box?: boolean;
  comment_placeholder?: string;
  questions?: Array<{
    id: string;
    text: string;
    type: "multiple_choice" | "text" | "scale";
    options?: string[];
    min?: number;
    max?: number;
  }>;
  email_placeholder?: string;
  show_name_field?: boolean;
  name_placeholder?: string;
  show_consent_checkbox?: boolean;
  consent_text?: string;
  social_platforms?: Array<{
    name: string;
    icon: string;
    url: string;
  }>;
  show_copy_link?: boolean;
  share_url?: string;
  end_date?: string;
  features?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  pricing?: {
    amount: number;
    currency: string;
    period: string;
  };
  countdown_end?: string;
  preferences?: string[];
  benefits?: string[];
  platforms?: string[];
  referral_code?: string;
}

export interface WebMessage {
  id: string;
  title: string;
  message: string;
  message_type?: "info" | "warning" | "success" | "error";
  display_duration: number;
  template_name: string;
  template_config?: TemplateConfig;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "center";
  theme?: "light" | "dark" | "custom";
  custom_theme?: ThemeConfig;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebAction {
  id: string;
  action_type: string;
  action_config: Record<string, unknown>;
  web_message?: WebMessage;
  web_message_id?: string;
  workflow_event: string;
  delay_seconds?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  conversion_tracking?: boolean;
  conversion_time?: string;
  revenue_property?: string;
  start_date?: string;
  end_date?: string;
}

export type EventCategory = "web" | "mobile";

export interface WebEvent {
  id: string;
  name: string;
  description?: string;
  category: EventCategory;
  event_type: string;
  parent_id?: string;
  parent?: WebEvent;
  children?: WebEvent[];
  subordinates?: number;
  actions?: WebAction[];
  position_x?: number;
  position_y?: number;
  created_at: string;
  updated_at: string;
  properties?: Record<string, any>;
}

export interface JsonWorkflow {
  id: string;
  name: string;
  description: string;
  live_status: boolean;
  is_active: boolean;
  events: WebEvent[];
  actions?: WebAction[];
  created_at: string;
  updated_at: string;
}

export interface CanvasWorkflow {
  id?: string;
  name?: string;
  description?: string;
  nodes?: Node[];
  edges?: Edge[];
  actions?: WebAction[];
  created_at?: string;
  updated_at?: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  created_at?: string;
}

export interface ActionType {
  id: string;
  name: string;
  description: string;
}

export interface TemplateListType {
  id: string;
  name: string;
  description: string;
}
