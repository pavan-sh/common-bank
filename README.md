# Common — Toy Finance Microfrontend

A local-only React + TypeScript banking UI scaffold using Webpack Module Federation. The host runs at `http://localhost:3000`; the Balance remote runs at `http://localhost:3001`.

The host and Balance remote use Tailwind CSS v4 via PostCSS. The `bootstrap.tsx` files are asynchronous Module Federation startup entries (needed to initialize shared React singletons); they are unrelated to the Bootstrap CSS framework.

Host and Balance both consume `@toy-finance/bank-data`, which defines the account API request and TanStack Query key. Because the host provides one shared QueryClient, the dashboard greeting/avatar and Balance widget use the same account result instead of making separate API requests. Configure `BANK_ACCOUNT_ID` (1–4) to choose the account.

## Run locally

1. Install dependencies from the repository root with `npm install`.
2. Start both workspaces with `npm run dev`.
3. Sign in with the demo-only credentials shown on the login screen: login ID `demo`, password `demo123`.

The login is a local UI gate only. It does not authenticate to the Bank API and does not protect real data.

## Balance API configuration (optional)

Copy `.env.example` to `.env` at the repository root and provide `BANK_SANDBOX_ID` and `BANK_BEARER_TOKEN` for the sandbox. Restart the dev server after changing settings. When these are absent, the Balance remote displays clearly labelled sample balances.

Webpack substitutes referenced environment variables into the client bundle. A token supplied this way is visible to anyone who can inspect the running app; use only disposable sandbox credentials, never deploy this setup, and never commit `.env`. Production-like authentication needs a server-side BFF/provider-backed session. The actual API response schema should be checked against the normalizer in `apps/balance/src/bankApi.ts`.

## Build

Run `npm run build` from the repository root to build the Balance remote and then the host.
