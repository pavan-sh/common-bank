import { useQuery } from "@tanstack/react-query";
import {
  getAccountQueryOptions,
  isBankApiConfigured,
} from "@toy-finance/bank-data";
import type { Account } from "@toy-finance/bank-data";
import "./styles.css";

const hasApiConfig = isBankApiConfigured();

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

const demoAccounts: Account[] = [
  {
    id: 1,
    owner: "Monica Geller",
    iban: "FUN-0001",
    currency: "USD",
    balance: 2450.75,
    status: "active",
  },
];

function AccountCard({ account, index }: { account: Account; index: number }) {
  const isSecondary = index % 2 === 1;
  const cardTheme = isSecondary
    ? "bg-gradient-to-br from-[#e3edce] to-[#d1e0b6] text-[#314235]"
    : "bg-gradient-to-br from-[#294638] to-[#1d342a] text-[#f7f9f4]";
  const secondaryText = isSecondary ? "text-[#697862]" : "text-[#c4d1c6]";

  return (
    <article
      className={`relative flex min-h-[195px] flex-col overflow-hidden rounded-xl p-[18px_20px] ${cardTheme}`}
    >
      <div className="flex items-center">
        <span
          className={`grid size-[27px] place-items-center rounded-full border text-xs font-bold ${isSecondary ? "border-[#53664a70]" : "border-[#ffffff58]"}`}
        >
          {account.currency.slice(0, 1)}
        </span>
        <span
          className={`ml-[9px] text-[10px] ${isSecondary ? "text-[#697862]" : "text-[#d1dbd1]"}`}
        >
          Everyday account
        </span>
        <span className="ml-auto text-[10px] tracking-[2px]" aria-hidden="true">
          •••
        </span>
      </div>
      <div className={`mt-[19px] text-[11px] ${secondaryText}`}>
        {account.owner ? `${account.owner} · ` : ""}
        {account.currency} account
      </div>
      <div className="mt-1 font-display text-[clamp(22px,3vw,29px)] font-bold tracking-[-1px]">
        {formatMoney(account.balance, account.currency)}
      </div>
      <div
        className={`mt-auto flex items-center justify-between pt-3.5 text-[10px] ${isSecondary ? "text-[#6c7a65]" : "text-[#c0cdc1]"}`}
      >
        <span className="relative z-10">
          {account.iban ??
            `Account ending in ${String(account.id).slice(-4).padStart(4, "0")}`}
        </span>
        <span className="relative z-10 flex items-center gap-2">
          {account.status && (
            <span className="capitalize">{account.status}</span>
          )}
          <span className="text-[15px]" aria-hidden="true">
            ↗
          </span>
        </span>
      </div>
      <span
        className="pointer-events-none absolute -bottom-[120px] -right-[92px] size-[180px] rounded-full border border-white/10 shadow-[0_0_0_22px_rgba(255,255,255,0.03),0_0_0_44px_rgba(255,255,255,0.02)]"
        aria-hidden="true"
      />
    </article>
  );
}

export function BalanceWidget() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    ...getAccountQueryOptions(),
    enabled: hasApiConfig,
  });

  const accounts = hasApiConfig ? data : demoAccounts;

  if (isLoading)
    return (
      <div
        className="flex min-h-[185px] items-center justify-center gap-3 rounded-2xl border border-[#e6eae1] bg-white p-6 text-[13px] text-[#78847c]"
        aria-live="polite"
      >
        <span className="size-4 animate-spin rounded-full border-2 border-[#dce5d1] border-t-[#55734f]" />
        Loading your accounts securely…
      </div>
    );
  if (isError)
    return (
      <div
        className="flex min-h-[185px] items-center justify-between gap-3 rounded-2xl border border-[#efdad4] bg-white p-6 text-sm text-[#76574d]"
        role="alert"
      >
        <div>
          <strong>We couldn’t load your accounts.</strong>
          <p className="mb-0 text-xs">
            {error instanceof Error
              ? error.message
              : "Please try again shortly."}
          </p>
        </div>
        <button
          className="rounded-md bg-[#31523d] px-3 py-2 text-[11px] font-bold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#9cbe70]"
          onClick={() => void refetch()}
        >
          Try again
        </button>
      </div>
    );
  if (!accounts?.length)
    return (
      <div className="flex min-h-[185px] items-center justify-center rounded-2xl border border-[#e6eae1] bg-white p-6 text-[13px] text-[#78847c]">
        No accounts in this sandbox yet.
      </div>
    );

  return (
    <section
      className="rounded-2xl border border-[#e6eae1] bg-white p-[19px] md:p-[26px]"
      aria-labelledby="accounts-heading"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#748779]">
            Your money at a glance
          </span>
          <h2
            id="accounts-heading"
            className="mt-[7px] font-display text-[21px] font-bold tracking-[-0.7px] text-[#293a30]"
          >
            Your balance
          </h2>
        </div>
        <span className="text-[11px] text-[#8a958b]">
          {hasApiConfig
            ? isFetching
              ? "Updating…"
              : "Sandbox data"
            : "Sample data"}
        </span>
      </div>
      {!hasApiConfig && (
        <p className="mb-[18px] mt-[-3px] rounded-lg bg-[#f4f7ed] px-[13px] py-[11px] text-[11px] leading-relaxed text-[#667460]">
          Showing sample balances. Add local sandbox settings to connect the
          Bank API. This demo login is not used as API authentication.
        </p>
      )}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {accounts.map((account, index) => (
          <AccountCard key={account.id} account={account} index={index} />
        ))}
      </div>
    </section>
  );
}
