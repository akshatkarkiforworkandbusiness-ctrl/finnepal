import type { User } from "@/types";
import { bizNames, kycStatuses, locations, owners, userStatuses } from "./seed";

export const users: User[] = owners.map((name, i) => ({
  id: `USR-${1001 + i}`,
  name,
  email: `${name.split(" ")[0].toLowerCase()}@orbit.demo`,
  phone: `+977 98${(10000000 + i * 137).toString().slice(0, 8)}`,
  businessId: `BIZ-${2001 + i}`,
  business: bizNames[i],
  status: userStatuses[i],
  kyc: kycStatuses[i],
  providers: (i % 3) + 1,
  transactions: 1248 - i * 87,
  lastActive: i === 0 ? "2 min ago" : `${i * 7 + 3} min ago`,
  joined: `Aug ${12 - (i % 10)}, 2026`,
  location: locations[i],
}));

export const getUserById = (id: string) => users.find((u) => u.id === id) ?? users[0];

export const userGrowthData = [
  { label: "26 Jul", newUsers: 11200, activeUsers: 18400 },
  { label: "2 Aug", newUsers: 11800, activeUsers: 19100 },
  { label: "9 Aug", newUsers: 12100, activeUsers: 20200 },
  { label: "16 Aug", newUsers: 12600, activeUsers: 21400 },
];

export const userStats = {
  total: 24850,
  newRegistrations: 2450,
  verifiedUsers: 21840,
  kycPending: 1126,
  kycRejected: 84,
  inactiveUsers: 612,
};
