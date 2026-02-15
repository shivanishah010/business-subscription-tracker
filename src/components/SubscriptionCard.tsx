import { getPresetLogo } from "@/lib/presets";
import { getCurrencySymbol } from "@/lib/currencies";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CATEGORY_COLORS, type Subscription } from "@/lib/types";

interface SubscriptionCardProps {
  subscription: Subscription;
  monthlyCost: number;
  globalCurrency: string;
  onToggle: (id: string) => void;
}

export function SubscriptionCard({
  subscription,
  monthlyCost,
  globalCurrency,
  onToggle,
}: SubscriptionCardProps) {
  const preset = getPresetLogo(subscription.logo);
  const isCustomLogo = !preset && subscription.logo.startsWith("data:");
  const symbol = getCurrencySymbol(globalCurrency);
  const categoryColor = CATEGORY_COLORS[subscription.category];

  return (
    <div className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Logo */}
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl">
        {preset ? (
          <div
            className="flex h-full w-full items-center justify-center rounded-2xl text-xl font-bold text-white"
            style={{ backgroundColor: `hsl(${preset.color})` }}
          >
            {preset.initials}
          </div>
        ) : isCustomLogo ? (
          <img
            src={subscription.logo}
            alt={subscription.name}
            className="h-full w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-muted text-xl font-bold text-muted-foreground">
            {subscription.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-card-foreground">
        {preset?.name ?? subscription.name}
      </h3>

      {/* Category */}
      <Badge variant="secondary" className={`text-[10px] ${categoryColor}`}>
        {subscription.category}
      </Badge>

      {/* Cost */}
      <p className="text-lg font-bold text-foreground">
        {symbol}
        {monthlyCost.toFixed(2)}
        <span className="text-xs font-normal text-muted-foreground">/mo</span>
      </p>

      {subscription.billingCycle === "annual" && (
        <span className="text-[10px] text-muted-foreground">
          ({getCurrencySymbol(subscription.currency)}
          {subscription.cost.toFixed(2)}/yr)
        </span>
      )}

      {/* Toggle */}
      <Switch
        checked={subscription.active}
        onCheckedChange={() => onToggle(subscription.id)}
      />
    </div>
  );
}
