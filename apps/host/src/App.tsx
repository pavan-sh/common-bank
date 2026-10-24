import React, { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAccountQueryOptions,
  isBankApiConfigured,
} from "@toy-finance/bank-data";

const BalanceWidget = React.lazy(() =>
  import("balance/BalanceWidget").then((module) => ({
    default: module.BalanceWidget,
  })),
);

const DEMO_LOGIN = "demo";
const DEMO_PASSWORD = "demo123";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <section
          className="flex flex-col gap-2 rounded-2xl border border-[#efdad4] bg-white p-6 text-sm text-[#78847c]"
          role="alert"
        >
          <strong className="text-[#34473a]">Balance is taking a break.</strong>
          <span>Check that the Balance service is running, then refresh.</span>
          <button
            className="self-start font-bold text-[#365841] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#9cbe70]"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loginId.trim() === DEMO_LOGIN && password === DEMO_PASSWORD) {
      setError("");
      onLogin();
      return;
    }
    setError(
      "That demo login didn’t match. Check the sample credentials below.",
    );
  }

  return (
    <main className="grid min-h-screen grid-cols-1 gap-[18px] bg-[#f6f7f3] p-[18px] font-sans text-[#202c27] md:grid-cols-[minmax(360px,0.95fr)_minmax(440px,1.05fr)]">
      <section
        className="relative flex min-h-[290px] flex-col justify-between overflow-hidden rounded-[22px] p-7 text-[#f7f9f4] md:min-h-[calc(100vh-36px)] md:p-[clamp(28px,5vw,68px)]"
        style={{
          background:
            "radial-gradient(ellipse at 72% 78%, #466d4e 0, transparent 34%), linear-gradient(145deg, #20392e, #172a24 68%, #244033)",
        }}
      >
        <a
          className="z-10 inline-flex items-center gap-2.5 font-display text-[21px] font-extrabold tracking-[-1.2px] text-[#f7f9f4] no-underline"
          href="#home"
          aria-label="Common home"
        >
          <span className="grid size-8 place-items-center rounded-full bg-[#d6ed8a] font-display text-[22px] font-extrabold tracking-[-2px] text-[#28422d]">
            c
          </span>
          <span>common</span>
        </a>
        <div className="z-10 my-12 max-w-[520px] self-center md:my-0">
          <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#c6dd94]">
            A little more at ease
          </span>
          <h1 className="my-[18px] font-display text-[38px] font-semibold leading-[1.08] tracking-[-3px] md:text-[clamp(38px,5vw,65px)]">
            Money feels better when it feels simple.
          </h1>
          <p className="max-w-[390px] text-base leading-[1.7] text-[#d0dad2] max-md:hidden">
            A calm place to see what’s yours, what’s next, and what matters.
          </p>
        </div>
        <div className="z-10 hidden text-[13px] text-[#b6c6ba] md:block">
          <span className="mr-2 text-[#d5eb92]">✳</span>Your money, in good
          company.
        </div>
      </section>
      <section
        className="grid place-items-center px-6 py-9 md:px-10"
        aria-labelledby="login-title"
      >
        <div className="w-full max-w-[410px]">
          <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#748779]">
            Welcome back
          </span>
          <h2
            id="login-title"
            className="mb-1 mt-3 font-display text-[30px] font-bold tracking-[-1.2px]"
          >
            Sign in to Common
          </h2>
          <p className="text-sm text-[#78847c]">
            Your financial world, right where you left it.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 grid">
            <label
              className="mb-2 text-xs font-bold text-[#39473f]"
              htmlFor="login-id"
            >
              Login ID
            </label>
            <input
              className="mb-5 h-12 rounded-[9px] border border-[#dce2da] bg-white px-3.5 text-[#26362e] outline-none focus:border-[#718b5a] focus:ring-[3px] focus:ring-[#9fba7230]"
              id="login-id"
              name="loginId"
              autoComplete="username"
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              required
            />
            <label
              className="mb-2 text-xs font-bold text-[#39473f]"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="mb-5 h-12 rounded-[9px] border border-[#dce2da] bg-white px-3.5 text-[#26362e] outline-none focus:border-[#718b5a] focus:ring-[3px] focus:ring-[#9fba7230]"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && (
              <p className="-mt-2 mb-3.5 text-xs text-[#a64038]" role="alert">
                {error}
              </p>
            )}
            <button
              className="mt-0.5 flex min-h-[50px] items-center justify-between rounded-[9px] bg-[#244334] px-[18px] font-bold text-[#f7f9f4] transition hover:-translate-y-px hover:bg-[#31563f] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#9cbe70]"
              type="submit"
            >
              Sign in <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="mt-6 rounded-[10px] border border-[#e3e9dc] bg-[#f9faf6] px-4 py-3.5 text-xs leading-[1.7] text-[#647168]">
            <strong className="text-[#344a3a]">Demo access</strong>
            <br />
            Login ID:{" "}
            <code className="rounded bg-[#eef1e8] px-1 py-0.5">demo</code>{" "}
            &nbsp; Password:{" "}
            <code className="rounded bg-[#eef1e8] px-1 py-0.5">demo123</code>
          </p>
          <p className="text-[11px] leading-relaxed text-[#939b94]">
            Demo only — this screen does not authenticate with a bank or protect
            real accounts.
          </p>
        </div>
      </section>
    </main>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { data: accounts } = useQuery({
    ...getAccountQueryOptions(),
    enabled: isBankApiConfigured(),
  });
  const owner = accounts?.[0]?.owner?.trim();
  const firstName = owner?.split(/\s+/)[0] || "there";
  const initials = owner
    ? owner
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toLocaleUpperCase())
        .join("")
    : "JD";
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  return (
    <main className="mx-auto min-h-screen max-w-[1320px] bg-[#f6f7f3] px-[22px] font-sans text-[#202c27] md:px-[52px]">
      <header className="flex h-[70px] items-center justify-between border-b border-[#e7eae3] md:h-[84px]">
        <a
          className="inline-flex items-center gap-2.5 font-display text-[21px] font-extrabold tracking-[-1.2px] text-[#20342b] no-underline"
          href="#home"
        >
          <span className="grid size-8 place-items-center rounded-full bg-[#d6ed8a] font-display text-[22px] font-extrabold tracking-[-2px] text-[#28422d]">
            c
          </span>
          <span>common</span>
        </a>
        <nav
          className="flex h-full items-center gap-3.5 md:gap-7"
          aria-label="Main navigation"
        >
          <a
            className="grid h-full place-items-center border-b-2 border-[#78965a] text-xs font-bold text-[#304b37] no-underline md:text-[13px]"
            href="#overview"
          >
            Overview
          </a>
          <a
            className="grid h-full place-items-center border-b-2 border-transparent text-xs text-[#89928a] no-underline md:text-[13px]"
            href="#activity"
            aria-disabled="true"
          >
            Activity
          </a>
        </nav>
        <button
          className="rounded-full border border-[#e4e8df] bg-white px-3 py-2 text-[11px] font-bold text-[#526356] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#9cbe70]"
          aria-label="Sign out"
          onClick={onLogout}
        >
          {initials} <span className="ml-2">⌄</span>
        </button>
      </header>
      <section className="flex flex-col items-start justify-between gap-[18px] py-[38px] md:flex-row md:items-end md:py-[52px_28px]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#748779]">
            {today}
          </span>
          <h1 className="mb-2 mt-2 font-display text-[clamp(30px,4vw,42px)] font-semibold tracking-[-2px]">
            Good morning, {firstName}{" "}
            <span className="text-[25px] text-[#93aa6a]" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p className="text-sm text-[#78847c]">
            Here’s the good in your finances today.
          </p>
        </div>
        <div className="mb-1.5 flex items-center gap-2 text-[11px] text-[#758177]">
          <span className="size-[7px] rounded-full bg-[#92ad68]" />
          Demo workspace
        </div>
      </section>
      <section className="min-h-[280px]" aria-label="Account balances">
        <Suspense
          fallback={
            <div
              className="grid min-h-[225px] place-items-center rounded-2xl border border-[#e6eae1] bg-white text-[13px] text-[#78847c]"
              aria-live="polite"
            >
              Gathering your balances…
            </div>
          }
        >
          <ErrorBoundary>
            <BalanceWidget />
          </ErrorBoundary>
        </Suspense>
      </section>
      <footer className="flex flex-col gap-2.5 border-t border-[#e7eae3] py-7 text-[11px] text-[#9aa39b] md:flex-row md:justify-between">
        <span>Made for a little more peace of mind.</span>
        <span>Sandbox demo · Not a real bank</span>
      </footer>
    </main>
  );
}

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  return signedIn ? (
    <Dashboard onLogout={() => setSignedIn(false)} />
  ) : (
    <Login onLogin={() => setSignedIn(true)} />
  );
}
