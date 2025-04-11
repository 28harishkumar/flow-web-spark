
import { JsonWorkflow, WebAction, WebEvent, WebMessage } from "@/types/workflow";

export const mockWebMessages: WebMessage[] = [
  {
    id: "1",
    title: "Welcome to Our Platform",
    message: "Thank you for signing up!",
    message_type: "success",
    display_duration: 5000,
    template_name: "welcome_campaign",
    template_config: {
      title: "Welcome!",
      message: "Thanks for joining us!",
      button_text: "Get Started",
      button_url: "/dashboard",
    },
    position: "top-right",
    theme: "light",
    is_active: true,
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
  {
    id: "2",
    title: "New Feature Available",
    message: "Check out our new workflow editor!",
    message_type: "info",
    display_duration: 8000,
    template_name: "product_announcement",
    template_config: {
      title: "New Feature",
      message: "Check out our new workflow editor!",
      button_text: "Try Now",
      button_url: "/dashboard/workflows",
      image_url: "/placeholder.svg",
    },
    position: "bottom-right",
    theme: "dark",
    is_active: true,
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
];

export const mockWebActions: WebAction[] = [
  {
    id: "1",
    action_type: "show_message",
    action_config: {
      message_id: "1",
    },
    web_message_id: "1",
    workflow_event: "user_signup",
    is_active: true,
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
  {
    id: "2",
    action_type: "show_message",
    action_config: {
      message_id: "2",
    },
    web_message_id: "2",
    workflow_event: "user_login",
    delay_seconds: 5,
    is_active: true,
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
];

export const mockWebEvents: WebEvent[] = [
  {
    id: "1",
    name: "User Signup",
    description: "User signs up to the platform",
    category: "web",
    event_type: "user_signup",
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
    actions: [mockWebActions[0]],
  },
  {
    id: "2",
    name: "User Login",
    description: "User logs in to the platform",
    category: "web",
    event_type: "user_login",
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
    actions: [mockWebActions[1]],
  },
  {
    id: "3",
    name: "User Purchase",
    description: "User purchases a product",
    category: "web",
    event_type: "user_purchase",
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
    actions: [],
  },
];

export const mockWorkflows: JsonWorkflow[] = [
  {
    id: "1",
    name: "Welcome Campaign",
    description: "Welcome new users to the platform",
    live_status: true,
    is_active: true,
    events: [mockWebEvents[0]],
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
  {
    id: "2",
    name: "Message Campaign",
    description: "Send a message to all users",
    live_status: true,
    is_active: true,
    events: [mockWebEvents[1]],
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
  {
    id: "3",
    name: "Promotion Campaign",
    description: "Promote a new product",
    live_status: true,
    is_active: true,
    events: [mockWebEvents[2]],
    actions: [mockWebActions[1]],
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
];
