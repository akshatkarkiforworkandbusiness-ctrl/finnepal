import type { Business, BusinessCategory } from "@/types";
import { activityLevels, bizNames, businessCategories, kycStatuses, locations, owners } from "./seed";

const types = [
  "Electronics", "Fashion", "Electronics", "Grocery", "Hardware",
  "Services", "Food & Beverage", "Beauty", "Automotive", "Healthcare",
  "Wholesale Trade", "Bakery", "Wholesale Trade", "Agriculture", "Freelance", "General Store",
];

const consentPattern: Business["consentStatus"][] = ["Granted", "Granted", "Granted", "Pending", "Revoked", "Granted", "Granted", "Expired"];

export const businesses: Business[] = bizNames.map((name, i) => ({
  id: `BIZ-${2001 + i}`,
  name,
  ownerId: `USR-${1001 + i}`,
  owner: owners[i],
  type: types[i],
  category: businessCategories[i] as BusinessCategory,
  location: locations[i],
  activity: activityLevels[i % 3],
  providers: (i % 3) + 1,
  status: (["Active", "Active", "Active", "Pending", "Suspended"] as Business["status"][])[i % 5],
  kyc: kycStatuses[i],
  created: `Aug ${12 - (i % 10)}, 2026`,
  monthlyVolume: 420000 - i * 18500,
  monthlySales: 184500 - i * 9200,
  monthlyExpenses: 112300 - i * 5100,
  tallyConnected: i % 3 !== 2,
  consentStatus: consentPattern[i % consentPattern.length],
}));

export const getBusinessById = (id: string) => businesses.find((b) => b.id === id) ?? businesses[0];

export const businessStats = {
  activeBusinesses: 8420,
  newThisWeek: 186,
  newThisMonth: 742,
};

export const businessesByCategory: { category: BusinessCategory; count: number; percentage: number }[] = [
  { category: "Retail", count: 3125, percentage: 37.1 },
  { category: "Restaurant", count: 1842, percentage: 21.9 },
  { category: "Services", count: 1450, percentage: 17.2 },
  { category: "Wholesale", count: 1022, percentage: 12.1 },
  { category: "Agriculture", count: 650, percentage: 7.7 },
  { category: "Freelancer", count: 212, percentage: 2.5 },
  { category: "Other", count: 119, percentage: 1.4 },
];
