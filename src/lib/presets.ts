export interface PresetLogo {
  key: string;
  name: string;
  color: string; // HSL background color
  initials: string;
}

export const PRESET_LOGOS: PresetLogo[] = [
  { key: "zoom", name: "Zoom", color: "210 100% 50%", initials: "Zm" },
  { key: "slack", name: "Slack", color: "340 70% 52%", initials: "Sl" },
  { key: "google", name: "Google Workspace", color: "217 89% 61%", initials: "G" },
  { key: "microsoft", name: "Microsoft 365", color: "28 100% 50%", initials: "M" },
  { key: "notion", name: "Notion", color: "0 0% 15%", initials: "N" },
  { key: "figma", name: "Figma", color: "270 60% 55%", initials: "Fi" },
  { key: "dropbox", name: "Dropbox", color: "215 100% 55%", initials: "Db" },
  { key: "claude", name: "Claude", color: "25 80% 55%", initials: "Cl" },
  { key: "chatgpt", name: "ChatGPT", color: "160 60% 42%", initials: "AI" },
  { key: "buffer", name: "Buffer", color: "0 0% 20%", initials: "Bu" },
  { key: "aws", name: "AWS", color: "30 100% 50%", initials: "AW" },
  { key: "github", name: "GitHub", color: "0 0% 13%", initials: "GH" },
  { key: "jira", name: "Jira", color: "214 82% 51%", initials: "Ji" },
  { key: "asana", name: "Asana", color: "348 73% 56%", initials: "As" },
  { key: "trello", name: "Trello", color: "206 76% 48%", initials: "Tr" },
  { key: "hubspot", name: "HubSpot", color: "14 100% 57%", initials: "HS" },
  { key: "mailchimp", name: "Mailchimp", color: "47 100% 50%", initials: "MC" },
  { key: "canva", name: "Canva", color: "250 63% 56%", initials: "Ca" },
  { key: "adobe", name: "Adobe CC", color: "0 90% 50%", initials: "Ad" },
  { key: "intercom", name: "Intercom", color: "214 80% 56%", initials: "IC" },
  { key: "linear", name: "Linear", color: "250 50% 50%", initials: "Li" },
  { key: "vercel", name: "Vercel", color: "0 0% 7%", initials: "V" },
  { key: "stripe", name: "Stripe", color: "250 80% 60%", initials: "St" },
  { key: "salesforce", name: "Salesforce", color: "205 75% 50%", initials: "SF" },
];

export function getPresetLogo(key: string): PresetLogo | undefined {
  return PRESET_LOGOS.find((p) => p.key === key);
}
