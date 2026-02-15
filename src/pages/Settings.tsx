import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { CATEGORIES, CATEGORY_COLORS, type Category, type Subscription } from "@/lib/types";
import { CURRENCIES, getCurrencySymbol } from "@/lib/currencies";
import { PRESET_LOGOS, getPresetLogo } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Pencil, Trash2, ExternalLink, Search } from "lucide-react";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface SubFormProps {
  initial?: Subscription;
  globalCurrency: string;
  onSave: (sub: Subscription) => void;
  onCancel: () => void;
}

function SubscriptionForm({ initial, globalCurrency, onSave, onCancel }: SubFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [logo, setLogo] = useState(initial?.logo ?? "");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    initial?.billingCycle ?? "monthly"
  );
  const [cost, setCost] = useState(initial?.cost?.toString() ?? "");
  const [currency, setCurrency] = useState(initial?.currency ?? globalCurrency);
  const [category, setCategory] = useState<Category>(initial?.category ?? "Software");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [exchangeRate, setExchangeRate] = useState(initial?.exchangeRate?.toString() ?? "");
  const [exchangeFrom, setExchangeFrom] = useState(initial?.exchangeFrom ?? currency);
  const [exchangeTo, setExchangeTo] = useState(initial?.exchangeTo ?? globalCurrency);

  const needsExchange = currency !== globalCurrency;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cost) return;

    const finalLogo = logo || name.charAt(0).toUpperCase();

    const sub: Subscription = {
      id: initial?.id ?? generateId(),
      name,
      logo: finalLogo,
      billingCycle,
      cost: parseFloat(cost),
      currency,
      category,
      endDate: endDate || undefined,
      active: initial?.active ?? true,
      exchangeRate: needsExchange && exchangeRate ? parseFloat(exchangeRate) : undefined,
      exchangeFrom: needsExchange ? exchangeFrom : undefined,
      exchangeTo: needsExchange ? exchangeTo : undefined,
    };
    onSave(sub);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zoom Pro" required />
      </div>

      {/* Logo preset picker */}
      <div className="space-y-2">
        <Label>Logo (optional preset)</Label>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
          {PRESET_LOGOS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => { setLogo(p.key); setName((prev) => prev || p.name); }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold text-white transition-all ${
                logo === p.key ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: `hsl(${p.color})` }}
              title={p.name}
            >
              {p.initials}
            </button>
          ))}
        </div>
      </div>

      {/* Billing cycle */}
      <div className="flex items-center gap-3">
        <Label>Billing</Label>
        <div className="flex items-center gap-2 text-sm">
          <span className={billingCycle === "monthly" ? "font-semibold text-foreground" : "text-muted-foreground"}>Monthly</span>
          <Switch
            checked={billingCycle === "annual"}
            onCheckedChange={(v) => setBillingCycle(v ? "annual" : "monthly")}
          />
          <span className={billingCycle === "annual" ? "font-semibold text-foreground" : "text-muted-foreground"}>Annual</span>
        </div>
      </div>

      {/* Cost + Currency */}
      <div className="space-y-1.5">
        <Label>{billingCycle === "annual" ? "Annual Cost" : "Monthly Cost"}</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            className="flex-1"
            required
          />
          <Select value={currency} onValueChange={(v) => { setCurrency(v); setExchangeFrom(v); }}>
            <SelectTrigger className="w-[100px]">
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
        </div>

        <a
          href="https://www.xe.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Check rates on xe.com <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Exchange rate */}
      {needsExchange && (
        <div className="space-y-1.5 rounded-lg border bg-muted/50 p-3">
          <Label className="text-xs text-muted-foreground">Exchange Rate</Label>
          <div className="flex items-center gap-2 text-sm">
            <span>1</span>
            <Select value={exchangeFrom} onValueChange={setExchangeFrom}>
              <SelectTrigger className="w-[90px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>=</span>
            <Input
              type="number"
              step="0.0001"
              min="0"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              placeholder="0.00"
              className="w-24 h-8 text-xs"
            />
            <Select value={exchangeTo} onValueChange={setExchangeTo}>
              <SelectTrigger className="w-[90px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Category */}
      <div className="space-y-1.5">
        <Label>Category</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                category === cat
                  ? CATEGORY_COLORS[cat] + " ring-2 ring-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* End date */}
      <div className="space-y-1.5">
        <Label>End Date (optional)</Label>
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">{initial ? "Update" : "Add"} Subscription</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

const Settings = () => {
  const {
    subscriptions,
    globalCurrency,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();

  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowForm(true);
    }
  }, [searchParams]);

  const handleSave = (sub: Subscription) => {
    if (editing) {
      updateSubscription(sub);
    } else {
      addSubscription(sub);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (sub: Subscription) => {
    setEditing(sub);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  const filteredSubs = subscriptions.filter((sub) => {
    const preset = getPresetLogo(sub.logo);
    const displayName = preset?.name ?? sub.name;
    return displayName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Manage Subscriptions
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subscription
              </Button>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search subscriptions…"
                  className="pl-9"
                />
              </div>
            </div>

            {filteredSubs.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                {subscriptions.length === 0 ? "No subscriptions added yet." : "No results found."}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredSubs.map((sub) => {
                  const preset = getPresetLogo(sub.logo);
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center gap-4 rounded-xl border bg-card p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
                        {preset ? (
                          <div
                            className="flex h-full w-full items-center justify-center rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: `hsl(${preset.color})` }}
                          >
                            {preset.initials}
                          </div>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                            {sub.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-card-foreground truncate">
                          {preset?.name ?? sub.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getCurrencySymbol(sub.currency)}{sub.cost.toFixed(2)}
                          {sub.billingCycle === "annual" ? "/yr" : "/mo"}
                          {" · "}
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[sub.category]}`}>
                            {sub.category}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(sub)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteSubscription(sub.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <SubscriptionForm
            initial={editing ?? undefined}
            globalCurrency={globalCurrency}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
};

export default Settings;
