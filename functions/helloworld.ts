interface Env {
  test_123: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const authHeader = context.request.headers.get("Authorization");
  const [authSchema, authValue] = parseAuthHeader(authHeader);

  const secret = context.env.test_123;
  return new Response(
    `Your auth schema is ${authSchema} with value ${authValue}. Secret is ${secret}`
  );
};

const parseAuthHeader = (header: string): [string, string] => {
  const parts = header.split(" ");
  if (parts.length !== 2)
    throw new Error("Invalid Authorization header detected");

  return parts as [string, string];
};
