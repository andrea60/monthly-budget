export class TokenExpiredError extends Error {
  constructor() {
    super("Token has expired");
  }
}
