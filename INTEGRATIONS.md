# Service integrations

## PayPal

The website uses the public PayPal JavaScript client ID and server credentials:

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

Subscription product and plan IDs are owned by `AutoResourceUpdaterBackend`, stored in MySQL and exposed to the website through `BACKEND_API_URL`. Create or recover missing Sandbox plans with:

```text
pnpm db:migrate
pnpm paypal:sync-plans
```

The catalog contains recurring plans for 7 days ($4.99), 1 month ($9.99), 6 months ($44.99) and 1 year ($79.99). Running the sync command again is idempotent because existing IDs are read from MySQL.

## Central backend

```env
BACKEND_API_URL=http://127.0.0.1:4785
```

Account, affiliate, free-trial, discount, PayPal catalog and checkout-tracking requests use this single server-side origin. Terms acceptance is saved with its version and timestamp when a PayPal subscription is registered.

## Discord authentication

Configure Auth.js with the Discord client ID, secret, application URL and secret. The callback remains `/api/auth/callback/discord` on the website origin.

## Payments currently available

Only PayPal is exposed. Former one-time-order and cryptocurrency routes return HTTP 410 and cannot create a payment.
