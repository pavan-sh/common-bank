const DEFAULT_API_BASE_URL = "https://funapi.dev/api/bank/v1";

function getBankConfig() {
  const configuredId = Number(process.env.BANK_ACCOUNT_ID || "1");
  const accountId =
    Number.isInteger(configuredId) && configuredId >= 1 && configuredId <= 4
      ? configuredId
      : 1;

  return {
    apiBaseUrl: process.env.BANK_API_BASE_URL || DEFAULT_API_BASE_URL,
    sandboxId: process.env.BANK_SANDBOX_ID || "",
    bearerToken: process.env.BANK_BEARER_TOKEN || "",
    accountId,
  };
}

function isBankApiConfigured() {
  const { sandboxId, bearerToken } = getBankConfig();
  return Boolean(sandboxId && bearerToken);
}

function getAccountQueryOptions() {
  const { apiBaseUrl, sandboxId, bearerToken, accountId } = getBankConfig();

  return {
    queryKey: ["bank", sandboxId || "demo", "account", String(accountId)],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${apiBaseUrl}/accounts/${accountId}`, {
        headers: {
          Accept: "application/json",
          "X-Sandbox-ID": sandboxId,
          Authorization: `Bearer ${bearerToken}`,
        },
        signal,
      });

      if (response.status === 404) return [];
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Sandbox authorization failed. Check the local sandbox credentials.",
          );
        }
        throw new Error(
          `Bank API request for account ${accountId} failed (${response.status}).`,
        );
      }

      return [normalizeAccount(await response.json(), accountId)];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  };
}

function normalizeAccount(payload, requestedId) {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("The Bank API returned an invalid account response.");
  }

  const balance = Number(payload.balance);
  if (
    (typeof payload.id !== "string" && typeof payload.id !== "number") ||
    typeof payload.currency !== "string" ||
    !Number.isFinite(balance)
  ) {
    throw new Error(
      `The Bank API response for account ${requestedId} is missing an id, currency, or numeric balance.`,
    );
  }

  return {
    id: payload.id,
    owner: typeof payload.owner === "string" ? payload.owner : undefined,
    iban: typeof payload.iban === "string" ? payload.iban : undefined,
    currency: payload.currency,
    balance,
    status: typeof payload.status === "string" ? payload.status : undefined,
  };
}

module.exports = { getAccountQueryOptions, getBankConfig, isBankApiConfigured };
