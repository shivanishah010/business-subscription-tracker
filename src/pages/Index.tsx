import { useSubscriptions } from "@/hooks/use-subscriptions";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { getCurrencySymbol, CURRENCIES } from "@/lib/currencies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Plus } from "lucide-react";

const Index = () => {
  const {
    subscriptions,
    globalCurrency,
    setGlobalCurrency,
    toggleActive,
    getMonthlyCost,
    totalMonthlySpend,
  } = useSubscriptions();

  const symbol = getCurrencySymbol(globalCurrency);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Subscriptions
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
            <Button variant="outline" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Total spend */}
        <div className="mb-8 text-center">
          <p className="text-sm text-muted-foreground">Monthly Spend</p>
          <p className="text-4xl font-bold text-foreground">
            {symbol}
            {totalMonthlySpend.toFixed(2)}
          </p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-muted-foreground">No subscriptions yet</p>
            <Button asChild>
              <Link to="/settings">
                <Plus className="mr-2 h-4 w-4" />
                Add Subscription
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                monthlyCost={getMonthlyCost(sub)}
                globalCurrency={globalCurrency}
                onToggle={toggleActive}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
