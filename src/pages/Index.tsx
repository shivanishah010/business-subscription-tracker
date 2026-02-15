import { useState } from "react";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { getCurrencySymbol, CURRENCIES } from "@/lib/currencies";
import { CATEGORIES, CATEGORY_COLORS, type Category } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Plus, Download } from "lucide-react";

const Index = () => {
  const {
    subscriptions,
    globalCurrency,
    setGlobalCurrency,
    toggleActive,
    getMonthlyCost,
    totalMonthlySpend,
  } = useSubscriptions();

  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const setCategoryFilterToggle = (cat: Category) => setCategoryFilter(prev => prev === cat ? null : cat);
  const symbol = getCurrencySymbol(globalCurrency);

  const filteredSubs = categoryFilter
    ? subscriptions.filter((s) => s.category === categoryFilter)
    : subscriptions;

  // Sort alphabetically
  const sortedSubs = [...filteredSubs].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  // Category totals for active subs
  const categoryTotals = CATEGORIES.map((cat) => {
    const total = subscriptions
      .filter((s) => s.active && s.category === cat)
      .reduce((sum, s) => sum + getMonthlyCost(s), 0);
    return { category: cat, total };
  }).filter((c) => c.total > 0);

  const exportCSV = () => {
    const headers = ["Name", "Category", "Billing Cycle", "Cost", "Currency", "Active", "Monthly Cost (" + globalCurrency + ")"];
    const rows = subscriptions.map((s) => [
      s.name,
      s.category,
      s.billingCycle,
      s.cost.toFixed(2),
      s.currency,
      s.active ? "Yes" : "No",
      getMonthlyCost(s).toFixed(2),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscriptions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Subscription Tracker
          </h1>
          <div className="flex items-center gap-3">
            <Select value={globalCurrency} onValueChange={setGlobalCurrency}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {subscriptions.length > 0 && (
              <Button variant="outline" size="icon" onClick={exportCSV} title="Export CSV">
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl w-full px-4 py-8 flex-1">
        {/* Category totals + Monthly spend on one row */}
        {categoryTotals.length > 0 && (
          <div className="mb-6 grid items-center gap-3" style={{ gridTemplateColumns: `repeat(${categoryTotals.length + (categoryTotals.length > 1 ? 2 : 1)}, 1fr)` }}>
            {categoryTotals.map(({ category, total }) => (
              <Card
                key={category}
                className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCategoryFilter(prev => prev === category ? null : category)}
              >
                <Badge variant="secondary" className={`text-[10px] mb-2 ${CATEGORY_COLORS[category]}`}>
                  {category}
                </Badge>
                <p className="text-lg font-bold text-foreground">
                  {symbol}{total.toFixed(2)}
                </p>
              </Card>
            ))}
            {categoryTotals.length > 1 && (
              <>
                <span className="text-xl font-bold text-muted-foreground text-center">=</span>
                <Card className="p-4 text-center">
                  <p className="text-[10px] mb-2 text-muted-foreground font-semibold">Monthly Spend</p>
                  <p className="text-lg font-bold text-foreground">
                    {symbol}{totalMonthlySpend.toFixed(2)}
                  </p>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Single category or no categories: show monthly spend card standalone */}
        {categoryTotals.length <= 1 && (
          <div className="mb-6 grid items-center gap-3" style={{ gridTemplateColumns: `repeat(${categoryTotals.length > 0 ? 3 : 1}, 1fr)` }}>
            {categoryTotals.map(({ category, total }) => (
              <Card
                key={category}
                className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCategoryFilter(prev => prev === category ? null : category)}
              >
                <Badge variant="secondary" className={`text-[10px] mb-2 ${CATEGORY_COLORS[category]}`}>
                  {category}
                </Badge>
                <p className="text-lg font-bold text-foreground">
                  {symbol}{total.toFixed(2)}
                </p>
              </Card>
            ))}
            {categoryTotals.length > 0 && (
              <span className="text-xl font-bold text-muted-foreground text-center">=</span>
            )}
            <Card className="p-4 text-center">
              <p className="text-[10px] mb-2 text-muted-foreground font-semibold">Monthly Spend</p>
              <p className="text-lg font-bold text-foreground">
                {symbol}{totalMonthlySpend.toFixed(2)}
              </p>
            </Card>
          </div>
        )}

        {/* Active category filter indicator */}
        {categoryFilter && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtering by:</span>
            <Badge variant="secondary" className={`${CATEGORY_COLORS[categoryFilter]}`}>
              {categoryFilter}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setCategoryFilter(null)} className="text-xs">
              Clear
            </Button>
          </div>
        )}

        {subscriptions.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-muted-foreground">No subscriptions yet</p>
            <Button asChild>
              <Link to="/settings?new=true">
                <Plus className="mr-2 h-4 w-4" />
                Add Subscription
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {sortedSubs.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  monthlyCost={getMonthlyCost(sub)}
                  globalCurrency={globalCurrency}
                  onToggle={toggleActive}
                  onCategoryClick={setCategoryFilterToggle}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link to="/settings?new=true">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subscription
                </Link>
              </Button>
            </div>
          </>
        )}
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Your data stays on your device. We don't collect any data from you.
      </footer>
    </div>
  );
};

export default Index;
