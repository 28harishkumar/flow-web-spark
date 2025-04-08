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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: Record<string, any>;
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
  features?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  questions?: Array<{
    type: "multiple_choice" | "text" | "scale";
    question: string;
    options?: string[];
    min?: number;
    max?: number;
  }>;
  preferences?: string[];
  benefits?: string[];
  platforms?: string[];
  referral_code?: string;
  countdown_end?: string;
  pricing?: {
    amount: number;
    currency: string;
    period: string;
  };
}

export interface WebMessage {
  id: number;
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
  delay_seconds?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface WebTemplate {
  id: string;
  title: string;
  message: string;
  message_type: "info" | "warning" | "success" | "error";
  display_duration: number;
  template_name: string;
  template_config: TemplateConfig;
  position:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "center";
  theme: "light" | "dark" | "custom";
  custom_theme: ThemeConfig;
}
