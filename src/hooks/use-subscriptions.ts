import { useState, useEffect, useCallback } from "react";
import type { Subscription } from "@/lib/types";

const SUBS_KEY = "subscription-tracker-subs";
const CURRENCY_KEY = "subscription-tracker-currency";

function loadSubs(): Subscription[] {
  try {
    const raw = localStorage.getItem(SUBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSubs(subs: Subscription[]) {
  localStorage.setItem(SUBS_KEY, JSON.stringify(subs));
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(loadSubs);
  const [globalCurrency, setGlobalCurrencyState] = useState<string>(() => {
    return localStorage.getItem(CURRENCY_KEY) ?? "USD";
  });

  useEffect(() => {
    saveSubs(subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, globalCurrency);
  }, [globalCurrency]);

  const addSubscription = useCallback((sub: Subscription) => {
    setSubscriptions((prev) => {
      const next = [...prev, sub];
      saveSubs(next);
      return next;
    });
  }, []);

  const updateSubscription = useCallback((sub: Subscription) => {
    setSubscriptions((prev) => {
      const next = prev.map((s) => (s.id === sub.id ? sub : s));
      saveSubs(next);
      return next;
    });
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSubs(next);
      return next;
    });
  }, []);

  const toggleActive = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  }, []);

  const setGlobalCurrency = useCallback((currency: string) => {
    setGlobalCurrencyState(currency);
  }, []);

  const getMonthlyCost = useCallback(
    (sub: Subscription): number => {
      const baseCost = sub.billingCycle === "annual" ? sub.cost / 12 : sub.cost;
      if (sub.currency === globalCurrency) return baseCost;
      if (sub.exchangeRate && sub.exchangeRate > 0) {
        return baseCost * sub.exchangeRate;
      }
      return baseCost; // fallback: no conversion
    },
    [globalCurrency]
  );

  const totalMonthlySpend = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + getMonthlyCost(s), 0);

  return {
    subscriptions,
    globalCurrency,
    setGlobalCurrency,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleActive,
    getMonthlyCost,
    totalMonthlySpend,
  };
}
