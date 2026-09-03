import { Business, BusinessType, UserProfile } from "@/types";

export const BUSINESS: Business = {
  id: "biz1",
  name: "Amit Stores",
  type: "Grocery / Kirana",
  location: "Kathmandu, Nepal",
  panVat: "123456789",
  fiscalYear: "Shrawan (July)",
};

export const BUSINESS_TYPES: BusinessType[] = [
  "Grocery / Kirana",
  "Restaurant / Cafe",
  "Clothing",
  "Pharmacy",
  "Electronics",
  "Other",
];

export const USER: UserProfile = {
  fullName: "Amit Shrestha",
  phone: "+977 98XXXXXXXX",
  email: "amitstores@gmail.com",
  location: "Kathmandu, Nepal",
  memberSince: "Sep 2025",
};
