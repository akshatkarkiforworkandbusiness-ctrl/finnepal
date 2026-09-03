import { apiRequest } from "./client";

export interface CustomerMe {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  location: string | null;
  user_type: string | null;
  financial_goal: string | null;
  occupation: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function getMe(): Promise<CustomerMe> {
  return apiRequest<CustomerMe>("/users/me", { auth: true });
}

export interface CustomerMeUpdate {
  name?: string;
  phone?: string;
  photo_url?: string;
  location?: string;
  user_type?: string;
  financial_goal?: string;
  occupation?: string;
}

export function updateMe(payload: CustomerMeUpdate): Promise<CustomerMe> {
  return apiRequest<CustomerMe>("/users/me", { method: "PATCH", body: payload, auth: true });
}
