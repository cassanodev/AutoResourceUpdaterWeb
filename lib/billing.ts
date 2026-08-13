export type PlanId = "weekly" | "monthly" | "six_months" | "yearly";
export type Plan = { id: PlanId; name: string; price: number; suffix: string; renewal: string };
export const plans: Record<PlanId, Plan> = {
  weekly: { id: "weekly", name: "7 Days", price: 4.99, suffix: "/ 7 days", renewal: "Renews every 7 days" },
  monthly: { id: "monthly", name: "1 Month", price: 9.99, suffix: "/ month", renewal: "Renews monthly" },
  six_months: { id: "six_months", name: "6 Months", price: 44.99, suffix: "/ 6 months", renewal: "Renews every 6 months" },
  yearly: { id: "yearly", name: "1 Year", price: 79.99, suffix: "/ year", renewal: "Renews annually" },
};
export function getPlan(value: unknown) { return typeof value === "string" && value in plans ? plans[value as PlanId] : null; }
export function discountedTotal(price: number, percentage: number) { return Math.max(0, Math.round(price * (1 - percentage / 100) * 100) / 100); }
export async function validateDiscount(code: string, plan: PlanId, buyerDiscordId?: string) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, code: "", discountPercentage: 0 };
  const base = process.env.BACKEND_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:4785";
  const response = await fetch(`${base}/api/billing/validate-discount`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: normalized, plan, discordId: buyerDiscordId }), cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error("Discount service unavailable");
  const data = await response.json() as { valid?: boolean; type?: "discount"|"referral"; discountPercentage?: number; error?: string; affiliate?: {discordUsername?:string} };
  const percentage = Number(data.discountPercentage || 0);
  return { valid: data.valid === true && percentage > 0 && percentage <= 100, type:data.type, code: normalized, discountPercentage: percentage, error:data.error, affiliate:data.affiliate };
}
