type Env = Record<string, string>;

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader)
    return new Response("No Authorization header found", { status: 401 });

  const [authSchema, authValue] = parseAuthHeader(authHeader);
  if (authSchema !== "Basic")
    return new Response("Authentication method not supported", { status: 400 });

  const [username, password] = parseNameAndPassword(authValue);

  const passcodeKey = "passcode_" + username;
  if (!(passcodeKey in context.env))
    return new Response("User not known", { status: 403 });

  const passcode = context.env[passcodeKey];

  if (passcode !== password)
    return new Response("Invalid password", { status: 403 });

  const secretKey = "client_secret_" + username;
  const clientSecret = context.env[secretKey] || "";

  const responseBody = { clientSecret };

  return new Response(JSON.stringify(responseBody), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
};

const parseAuthHeader = (header: string): [string, string] => {
  const parts = header.split(" ");
  if (parts.length !== 2)
    throw new Error("Invalid Authorization header detected");

  return parts as [string, string];
};

const parseNameAndPassword = (authHeaderValue: string): [string, string] => {
  const parts = atob(authHeaderValue).split(":");
  if (parts.length !== 2) throw new Error("Invalid Authorization header value");

  return parts as [string, string];
};
