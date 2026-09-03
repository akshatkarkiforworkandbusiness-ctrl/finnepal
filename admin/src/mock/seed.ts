// Shared generator seed data for src/mock/*.ts — not consumed by pages directly.
import type { Business, BusinessCategory, KycStatus, User } from "@/types";

export const owners = [
  "Amit Pokhrel", "Sita Shrestha", "Ram Karki", "Gita Thapa", "Hari Adhikari",
  "Bina Rai", "Nabin Gurung", "Puja Magar", "Deepak Lama", "Anita Basnet",
  "Rohan Shakya", "Priya Maharjan", "Suman Bhattarai", "Kabita Poudel", "Bikash Tamang", "Sarita Khadka",
];

export const bizNames = [
  "Amit Mobile Store", "Sita Boutique", "Ram Electronics", "Gita Grocery", "Hari Hardware",
  "Bina Tailors", "Nabin Cafe", "Puja Salon", "Deepak Motors", "Anita Pharmacy",
  "Rohan Traders", "Priya Bakery", "Suman Wholesale Mart", "Kabita Farm Supplies", "Bikash Freelance Studio", "Sarita General Store",
];

export const businessCategories: BusinessCategory[] = [
  "Retail", "Retail", "Retail", "Restaurant", "Services",
  "Services", "Restaurant", "Services", "Retail", "Retail",
  "Wholesale", "Restaurant", "Wholesale", "Agriculture", "Freelancer", "Other",
];

export const locations = [
  "Itahari", "Kathmandu", "Pokhara", "Biratnagar", "Lalitpur",
  "Dharan", "Butwal", "Bhaktapur", "Chitwan", "Birgunj",
  "Hetauda", "Nepalgunj", "Dhangadhi", "Janakpur", "Kathmandu", "Pokhara",
];

export const userStatuses: User["status"][] = [
  "Active", "Active", "Active", "Pending", "Suspended", "Active",
  "Active", "Pending", "Active", "Active", "Active", "Active", "Pending", "Active", "Suspended", "Active",
];

export const kycStatuses: KycStatus[] = [
  "Verified", "Verified", "Pending", "Verified", "Review Required",
  "Verified", "Rejected", "Pending", "Verified", "Verified", "Verified", "Pending", "Verified", "Review Required", "Rejected", "Verified",
];

export const activityLevels: Business["activity"][] = ["High", "Medium", "Low"];

export const providerNames = ["eSewa", "Khalti", "Bank", "Cash", "Other"] as const;
