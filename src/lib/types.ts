export interface Subscription {
  id: string;
  name: string;
  logo: string; // preset key or data URL for custom uploads
  billingCycle: "monthly" | "annual";
  cost: number; // actual amount user pays (monthly or annual)
  currency: string; // currency code e.g. "USD", "GBP"
  category: Category;
  endDate?: string; // ISO date string
  active: boolean; // on/off for current month
  exchangeRate?: number; // rate to convert 1 unit of this currency to global currency
  exchangeFrom?: string; // source currency for rate
  exchangeTo?: string; // target currency for rate
}

export type Category = "Software" | "Utilities" | "Communication" | "Cloud" | "Marketing" | "Other";

export const CATEGORIES: Category[] = ["Software", "Utilities", "Communication", "Cloud", "Marketing", "Other"];

export const CATEGORY_COLORS: Record<Category, string> = {
  Software: "bg-blue-100 text-blue-700",
  Utilities: "bg-amber-100 text-amber-700",
  Communication: "bg-green-100 text-green-700",
  Cloud: "bg-purple-100 text-purple-700",
  Marketing: "bg-pink-100 text-pink-700",
  Other: "bg-slate-100 text-slate-700",
};
