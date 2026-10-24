import type { UseQueryOptions } from "@tanstack/react-query";

export type Account = {
  id: number | string;
  owner?: string;
  iban?: string;
  currency: string;
  balance: number;
  status?: string;
};

type AccountQueryKey = ["bank", string, "account", string];

export declare function getBankConfig(): {
  apiBaseUrl: string;
  sandboxId: string;
  bearerToken: string;
  accountId: number;
};

export declare function isBankApiConfigured(): boolean;

export declare function getAccountQueryOptions(): UseQueryOptions<
  Account[],
  Error,
  Account[],
  AccountQueryKey
>;
