import { JsonWorkflow } from "@/types/workflow";

export const mockWorkflows: JsonWorkflow[] = [
  {
    id: "1",
    name: "Welcome Campaign",
    description: "Welcome new users to the platform",
    live_status: true,
    is_active: true,
    events: [
      {
        id: "1",
        name: "User Signup",
        description: "User signs up to the platform",
        category: "web",
        event_type: "user_signup",
        created_at: "2021-01-01",
        updated_at: "2021-01-01",
      },
    ],
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
  {
    id: "2",
    name: "Message Campaign",
    description: "Send a message to all users",
    live_status: true,
    is_active: true,
    events: [
      {
        id: "2",
        name: "User Login",
        description: "User logs in to the platform",
        category: "web",
        event_type: "user_login",
        created_at: "2021-01-01",
        updated_at: "2021-01-01",
      },
    ],
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
  {
    id: "3",
    name: "Promotion Campaign",
    description: "Promote a new product",
    live_status: true,
    is_active: true,
    events: [
      {
        id: "3",
        name: "User Purchase",
        description: "User purchases a product",
        category: "web",
        event_type: "user_purchase",
        created_at: "2021-01-01",
        updated_at: "2021-01-01",
      },
    ],
    created_at: "2021-01-01",
    updated_at: "2021-01-01",
  },
];
