import { getPresetLogo } from "@/lib/presets";
import { getCurrencySymbol } from "@/lib/currencies";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CATEGORY_COLORS, type Category, type Subscription } from "@/lib/types";

interface SubscriptionCardProps {
  subscription: Subscription;
  monthlyCost: number;
  globalCurrency: string;
  onToggle: (id: string) => void;
  onCategoryClick?: (category: Category) => void;
}

export function SubscriptionCard({
  subscription,
  monthlyCost,
  globalCurrency,
  onToggle,
  onCategoryClick,
}: SubscriptionCardProps) {
  const preset = getPresetLogo(subscription.logo);
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

      {/* Category - clickable for filtering */}
      <button type="button" onClick={() => onCategoryClick?.(subscription.category)}>
        <Badge variant="secondary" className={`text-[10px] cursor-pointer ${categoryColor}`}>
          {subscription.category}
        </Badge>
      </button>

      {/* Cost + annual info in fixed-height block */}
      <div className="flex flex-col items-center h-14 justify-center">
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
      </div>

      {/* Toggle */}
      <Switch
        checked={subscription.active}
        onCheckedChange={() => onToggle(subscription.id)}
        className="scale-[0.85]"
      />
    </div>
  );
}
