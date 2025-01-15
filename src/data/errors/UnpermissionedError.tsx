export class UnpermissionedError extends Error {
  constructor() {
    super("App is not permissioned");
  }
}
