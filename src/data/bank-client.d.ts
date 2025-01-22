export type MonzoAccount = {
  id: string;
  balanceGbp: number;
};

export interface MonzoClient {
  getAccounts(): Promise<MonzoAccount[]>;
  checkPermissions(): Promise<boolean>;
}
