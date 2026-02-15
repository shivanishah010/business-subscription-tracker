# Subscription Tracker

A simple, visual subscription tracker for managing business subscriptions with monthly on/off toggling and spend tracking.

## Dashboard (Homepage)

- **Local currency selector** at the top (option to choose from all currencies e.g. GBP, USD, EUR, INR, DKK etc.)
- **Grid of subscription cards**, each showing:
  - Large logo/icon of the service
  - Subscription name
  - Monthly cost (converted to global currency if different; annual subscriptions show cost ÷ 12 on dashboard)
  - Category tag (e.g. "Software", "Utilities", "Communication", "Cloud", etc.)
  - A simple **on/off toggle** for the current month
- **Total monthly spend** displayed prominently, summing all active subscriptions in the local currency
- Clean, image-forward design with minimal text

## Add/Edit Subscription (Settings Page)

- Form to add a new subscription:
  - Name
  - Logo: pick from a **preset library** of ~20 common business tools (Zoom, Slack, Google Workspace, Notion, Figma, Dropbox, Claude, Buffer, etc.) **or upload a custom image**
  - **Billing cycle**: Monthly or Annual toggle
  - Cost + **currency selector** (per-subscription) — user enters the actual amount they pay (monthly or annual)
  - Below the cost field: where the subscription currency is not in the user's global currency, a link to [xe.com](https://www.xe.com/) for quick exchange rate reference and fields for users to enter the exchange rate (should include all currency options in both fields)
  - Category tag (Software, Utilities, Communication, Cloud, Marketing, Other)
  - Subscription end date (optional)
- Ability to edit or delete existing subscriptions
- Ability to update rates when they change
- Annual subscriptions automatically display as cost ÷ 12 on the dashboard

## Currency Conversion

- **Manual exchange rates**: user enters rates (e.g. 1 USD = 0.79 GBP) in a simple settings area while entering costs
- Dashboard automatically converts non-global-currency subscriptions using these rates

## Data Storage

- All data stored locally in the browser (localStorage) — no login required, instant setup

## Design

- Minimal, card-based layout with large logos as the visual focus
- Soft color-coded category tags
- Light/clean aesthetic, mobile-friendly