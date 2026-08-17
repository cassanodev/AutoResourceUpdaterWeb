const api = () =>
  process.env.PAYPAL_API_URL?.replace(/\/$/, "") ||
  "https://api-m.sandbox.paypal.com";
async function accessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal is not configured");
  const response = await fetch(`${api()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("PayPal authentication failed");
  return ((await response.json()) as { access_token: string }).access_token;
}

export async function createSubscription(input: {
  planId: string;
  amount: number;
  regularCycleSequence: number;
  baseAmount: number;
  userId: string;
  discountCode?: string;
}) {
  const token = await accessToken();
  const response = await fetch(`${api()}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": crypto.randomUUID(),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      plan_id: input.planId,
      custom_id: input.userId,
      ...(input.amount !== input.baseAmount
        ? {
            plan: {
              billing_cycles: [
                {
                  sequence: input.regularCycleSequence,
                  pricing_scheme: {
                    fixed_price: {
                      currency_code: "USD",
                      value: input.amount.toFixed(2),
                    },
                  },
                },
              ],
            },
          }
        : {}),
      application_context: {
        brand_name: "Auto Resource Updater",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
      },
    }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) {
    const details = Array.isArray(data?.details)
      ? data.details
          .map((detail: { field?: string; description?: string }) =>
            [detail.field, detail.description].filter(Boolean).join(": "),
          )
          .filter(Boolean)
          .join("; ")
      : "";
    throw new Error(
      [details, data?.message, data?.debug_id && `PayPal ID: ${data.debug_id}`]
        .filter(Boolean)
        .join(" — ") || "Unable to create PayPal subscription",
    );
  }
  return data as { id: string; status: string };
}

export async function getSubscriptionPlan(planId: string) {
  const normalizedPlanId = planId.trim();
  if (!/^P-[A-Z0-9]+$/.test(normalizedPlanId))
    throw new Error("The PayPal plan ID must begin with P-");

  const token = await accessToken();
  const response = await fetch(
    `${api()}/v1/billing/plans/${encodeURIComponent(normalizedPlanId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  const data = await response.json();
  if (!response.ok)
    throw new Error(data?.message || "Unable to read the PayPal plan");
  if (data.status !== "ACTIVE")
    throw new Error("The PayPal plan is not active");

  const regularCycle = data.billing_cycles?.find(
    (cycle: { tenure_type?: string }) => cycle.tenure_type === "REGULAR",
  );
  const baseAmount = Number(regularCycle?.pricing_scheme?.fixed_price?.value);
  if (!regularCycle?.sequence || !Number.isFinite(baseAmount))
    throw new Error(
      "The PayPal plan does not have a valid regular billing cycle",
    );

  return {
    id: normalizedPlanId,
    regularCycleSequence: Number(regularCycle.sequence),
    baseAmount,
  };
}
export async function captureOrder(orderId: string) {
  const token = await accessToken();
  const response = await fetch(
    `${api()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": crypto.randomUUID(),
      },
      body: "{}",
      cache: "no-store",
    },
  );
  const data = await response.json();
  if (!response.ok)
    throw new Error(data?.message || "Unable to capture PayPal order");
  return data;
}
