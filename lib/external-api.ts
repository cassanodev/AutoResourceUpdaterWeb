import type { PlanId } from "./billing";
import { createHmac } from "node:crypto";

const headers = () => ({ "Content-Type": "application/json" });
const backend = () => {
  const value = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  if (!value) throw new Error("API_NOT_CONFIGURED");
  return value;
};
async function post(path: string, body: unknown) {
  const response = await fetch(`${backend()}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}
async function signedPost(path: string, body: unknown) {
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!secret) throw new Error("Secure backend connection is not configured");
  const payload = JSON.stringify(body),
    timestamp = Date.now().toString(),
    signature = createHmac("sha256", secret)
      .update(`${timestamp}.${payload}`)
      .digest("hex");
  const response = await fetch(`${backend()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-ARU-Timestamp": timestamp,
      "X-ARU-Signature": signature,
    },
    body: payload,
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export async function isBackendAdmin(discordId: string) {
  const { response, data } = await signedPost("/api/admin/authorize", {
    discordId,
  });
  return response.ok && data.allowed === true;
}

export type ReferralStatus =
  "qualified" | "pending" | "inactive" | "not-applicable";
export type AffiliateData = {
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarned: number;
  qualifiedCount: number;
  referralCode: string;
  referrals: Array<{
    discordId: string;
    discordUsername: string;
    registeredAt: string;
    plan: string;
    commission: number;
    status: ReferralStatus;
    qualifiesAt?: string | null;
  }>;
};
export async function getAffiliateData(discordId: string) {
  const { response, data } = await signedPost("/api/affiliates/get", {
    discordId,
  });
  if (
    response.status === 401 ||
    response.status === 403 ||
    data.allowed === false
  )
    return { allowed: false as const };
  if (!response.ok)
    throw new Error(data.error || "Affiliate service unavailable");
  return { allowed: true as const, data: data.affiliate as AffiliateData };
}
export async function requestAffiliateWithdrawal(
  discordId: string,
  input: {
    amount: number;
    method: "paypal";
    referenceType: "email" | "paypal_me";
    reference: string;
  },
) {
  const { response, data } = await signedPost("/api/affiliates/withdraw", {
    discordId,
    ...input,
  });
  if (response.status === 401 || response.status === 403)
    throw new Error("You do not have permission to request a withdrawal");
  if (!response.ok)
    throw new Error(data.error || "Unable to request withdrawal");
  return data;
}
export async function startTrial(discordId: string) {
  const { response, data } = await post("/api/trials/start", { discordId });
  if (!response.ok) throw new Error(data.error || "Unable to start free trial");
  return data as { success: boolean; expiresAt?: string };
}
export async function cancelSubscriptionRenewal(discordId: string) {
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!secret) throw new Error("Cancellation service is not configured");
  const payload = JSON.stringify({ discordId });
  const timestamp = Date.now().toString();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const response = await fetch(
    `${backend()}/api/subscriptions/cancel-renewal`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ARU-Timestamp": timestamp,
        "X-ARU-Signature": signature,
      },
      body: payload,
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    },
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data.error || data.detail || "Unable to cancel subscription renewal",
    );
  return data as {
    success: boolean;
    alreadyCancelled?: boolean;
    accessUntil?: string;
  };
}
export type AdminOverview = {
  identity: { discordId: string; role: string; isOwner: boolean };
  affiliates: Array<{
    discordId: string;
    discordUsername: string;
    referralCode: string;
    status: string;
    reviewReason?: string | null;
    createdAt: string;
    reviewedAt?: string | null;
    availableBalance: number;
    pendingBalance: number;
  }>;
  admins: Array<{
    discordId: string;
    discordUsername: string;
    active: boolean;
    createdAt: string;
    addedBy: string;
  }>;
  withdrawals: Array<{
    id: number;
    discordId: string;
    discordUsername: string;
    discordEmail?: string | null;
    amount: number;
    status: string;
    destination?:
      { method: string; referenceType: string; reference: string } | string;
    providerReference?: string | null;
    rejectionReason?: string | null;
    requestedAt: string;
    reviewedAt?: string | null;
  }>;
};
export async function getAdminOverview(adminDiscordId: string) {
  const { response, data } = await signedPost("/api/admin/overview", {
    adminDiscordId,
  });
  if (!response.ok) throw new Error(data.error || "Unable to load admin panel");
  return data as AdminOverview;
}
export async function setAdminAffiliateStatus(input: {
  adminDiscordId: string;
  targetDiscordId: string;
  targetUsername?: string;
  referralCode?: string;
  status: "approved" | "rejected" | "suspended";
  reason?: string;
}) {
  const { response, data } = await signedPost(
    "/api/admin/affiliates/status",
    input,
  );
  if (!response.ok) throw new Error(data.error || "Unable to update affiliate");
  return data;
}
export async function reviewAdminWithdrawal(input: {
  adminDiscordId: string;
  withdrawalId: number;
  action: "approve" | "reject" | "paid";
  reason?: string;
  providerReference?: string;
}) {
  const { response, data } = await signedPost(
    "/api/admin/withdrawals/review",
    input,
  );
  if (!response.ok)
    throw new Error(data.error || "Unable to review withdrawal");
  return data;
}
export async function adjustAdminBalance(input: {
  adminDiscordId: string;
  targetDiscordId: string;
  operation: "add" | "remove" | "set";
  amount: number;
  reason: string;
}) {
  const { response, data } = await signedPost("/api/admin/balances", input);
  if (!response.ok)
    throw new Error(data.error || data.detail || "Unable to adjust balance");
  return data;
}
export async function setBackendAdmin(input: {
  adminDiscordId: string;
  targetDiscordId: string;
  targetUsername?: string;
  active: boolean;
}) {
  const { response, data } = await signedPost("/api/admin/admins", input);
  if (!response.ok)
    throw new Error(
      data.error || data.detail || "Unable to update administrator",
    );
  return data;
}
export async function getPayPalPlan(plan: PlanId) {
  const response = await fetch(
    `${backend()}/api/billing/paypal/plans/${plan}`,
    { cache: "no-store", signal: AbortSignal.timeout(8000) },
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.id)
    throw new Error(data.error || "PayPal plan is not configured");
  return data as { id: string; amount: number };
}

export type AccountData = {
  discordId: string;
  discordUsername?: string | null;
  referralCode: string;
  subscription: null | {
    plan: PlanId | "lifetime";
    status: string;
    provider: string;
    amount: number;
    currency: string;
    renewsAt?: string | null;
    cancelAtPeriodEnd: boolean;
  };
  trial: null | { status: string; startsAt: string; expiresAt: string };
};
export async function getAccountData(
  discordId: string,
  profile?: {
    username?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  },
) {
  const { response, data } = await post("/api/accounts/get", {
    discordId,
    discordUsername: profile?.username || undefined,
    discordEmail: profile?.email || undefined,
    discordAvatarUrl: profile?.avatarUrl || undefined,
  });
  if (!response.ok)
    throw new Error(data.error || data.detail || "Account service unavailable");
  return data as AccountData;
}
export async function registerPayPalCheckout(input: {
  discordId: string;
  discordUsername?: string | null;
  discordEmail?: string | null;
  externalId: string;
  kind: "subscription";
  plan: PlanId;
  amount: number;
  termsAccepted: true;
  termsVersion: string;
  discountCode?: string;
  discountPercentage?: number;
}) {
  const { response, data } = await signedPost(
    "/api/billing/paypal/checkouts",
    input,
  );
  if (!response.ok)
    throw new Error(
      data.error || data.detail || "Unable to register PayPal checkout",
    );
  return data;
}
