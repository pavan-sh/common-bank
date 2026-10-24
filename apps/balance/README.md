# Balance app

Balance is the first small feature app that plugs into the Common host. It shows account balances in the host dashboard. The host and Balance are separate React apps, so each can be started and built on its own.

## How it connects to the host

1. The host runs at `http://localhost:3000`. Balance runs at `http://localhost:3001` during development.
2. The host’s Webpack Module Federation settings give the remote the short name `balance` and point it to Balance’s `remoteEntry.js` file.
3. Balance publishes its `BalanceWidget` component under the name `./BalanceWidget`.
4. The host imports that component as `balance/BalanceWidget` and loads it only when the dashboard needs it. If the remote is still loading, the host shows a loading message. If it fails, the host shows a friendly fallback.
5. Both apps share one copy of React, React DOM, TanStack Query, and the `@toy-finance/bank-data` helper while they are running together. The helper defines the API request and query key. Since the host provides the shared query client, the Balance widget and host dashboard reuse the same account response and cache entry.

The widget can also run by itself at `http://localhost:3001`. Its local entry starts its own React root and query client; when loaded by the host, the host provides those instead.

## Run the apps

From the repository root, run `npm install`, then `npm run dev`. This starts the host and Balance remote together. Keep both running because the host loads the widget from the Balance server.

## Balance data

Without API settings, the widget shows one clearly labelled sample balance for account 1. To try the sandbox API locally, provide `BANK_SANDBOX_ID` and `BANK_BEARER_TOKEN` in the root `.env` file. The widget requests exactly one account detail, `/accounts/{BANK_ACCOUNT_ID}`. `BANK_ACCOUNT_ID` can be set to 1, 2, 3, or 4; it defaults to 1. The displayed owner, IBAN, balance, currency, and status come from that account response.

This is a toy demo. The login screen is not API authentication, and values added to `.env` are bundled into browser code and can be inspected. Use only disposable sandbox credentials; do not use real banking credentials or deploy this setup.
