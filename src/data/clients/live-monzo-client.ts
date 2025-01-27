import { MonzoAccount, MonzoClient } from "../bank-client";
import { TokenExpiredError } from "../errors/TokenExpiredError";
import { UnpermissionedError } from "../errors/UnpermissionedError";

type MonzoApiAccount = {
  id: string;
  description: string;
  created: string;
};

type MonzoApiAccountResponse = {
  accounts: MonzoApiAccount[];
};

type MonzoApiBalance = {
  balance: number;
  total_balance: number;
  currency: string;
  spend_today: number;
};

type MonzoApiError = {
  code: string;
  error: string;
  error_description: string;
  message: string;
};

export class LiveMonzoClient implements MonzoClient {
  constructor(private getAccessToken: () => Promise<string | undefined>) {}
  async checkPermissions(): Promise<boolean> {
    try {
      await this.getAccounts();
      return true;
    } catch {
      return false;
    }
  }

  async getAccounts(): Promise<MonzoAccount[]> {
    const accessToken = await this.getAccessToken();
    const accountsResponse = await fetch("https://api.monzo.com/accounts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!accountsResponse.ok) {
      await this.handleErrorResponse(accountsResponse);
    }

    const { accounts }: MonzoApiAccountResponse = await accountsResponse.json();

    const balances = await Promise.all(
      accounts.map((acc) => this.fetchBalance(acc.id))
    );

    return accounts.map((acc) => {
      const balance = balances.find((b) => b.accountId === acc.id);
      if (!balance) {
        throw new Error(`Failed to find balance for account ${acc.id}`);
      }
      return {
        id: acc.id,
        balanceGbp: balance.balance * 0.01,
      };
    });
  }

  private fetchBalance = async (accountId: string) => {
    const accessToken = await this.getAccessToken();
    const balanceResponse = await fetch(
      `https://api.monzo.com/balance?account_id=${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!balanceResponse.ok) {
      await this.handleErrorResponse(balanceResponse);
    }

    const balance: MonzoApiBalance = await balanceResponse.json();
    return { ...balance, accountId };
  };

  private handleErrorResponse = async (response: Response) => {
    if (response.status === 401) {
      const responseMsg: MonzoApiError = await response.json();
      if (
        [
          "unauthorized.bad_access_token.expired",
          "unauthorized.bad_access_token.evicted",
        ].includes(responseMsg.code)
      )
        throw new TokenExpiredError();
    }
    if (response.status === 403) {
      const responseMsg: MonzoApiError = await response.json();
      if (responseMsg.code === "forbidden.insufficient_permissions")
        throw new UnpermissionedError();
    }

    throw new Error(`Unexpected error from Monzo API: ${response.status}`);
  };
}
