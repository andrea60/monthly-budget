export type MonzoAccount = {
  id: string;
  description: string;
  balance: number;
  currency: string;
  totalBalance: number;
  spendToday: number;
};

export interface MonzoClient {
  getAccounts(): Promise<MonzoAccount[]>;
  checkPermissions(): Promise<boolean>;
}
