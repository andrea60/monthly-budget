import { MonzoAccount, MonzoClient } from "../data/bank-client";

export class FakeMonzoClient implements MonzoClient {
  constructor(
    public accounts: MonzoAccount[] = [],
    public hasPermissions: boolean = true
  ) {}

  getAccounts(): Promise<MonzoAccount[]> {
    return Promise.resolve(this.accounts);
  }
  checkPermissions(): Promise<boolean> {
    return Promise.resolve(this.hasPermissions);
  }
}
