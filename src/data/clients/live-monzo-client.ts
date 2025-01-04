import { MonzoAccount, MonzoClient } from "../bank-client";

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

export class LiveMonzoClient implements MonzoClient {
  constructor(private getAccessToken: () => Promise<string | undefined>) {}

  async getAccounts(): Promise<MonzoAccount[]> {
    const accessToken = await this.getAccessToken();
    const accountsResponse = await fetch("https://api.monzo.com/accounts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!accountsResponse.ok) {
      throw new Error(
        "Failed to fetch Monzo accounts. Status code: " +
          accountsResponse.status
      );
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
        ...acc,
        balance: balance.balance,
        currency: balance.currency,
        spendToday: balance.spend_today,
        totalBalance: balance.total_balance,
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
      throw new Error(
        "Failed to fetch Monzo balance. Status code: " + balanceResponse.status
      );
    }

    const balance: MonzoApiBalance = await balanceResponse.json();
    return { ...balance, accountId };
  };
}
