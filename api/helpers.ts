import { IncomingMessage, ServerResponse } from "http";

export function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export function wrapResponse(res: ServerResponse): any {
  let statusCode = 200;

  res.json = function (data: any) {
    this.setHeader("Content-Type", "application/json");
    this.statusCode = statusCode;
    this.end(JSON.stringify(data));
    return this;
  };

  res.status = function (code: number) {
    statusCode = code;
    return this;
  };

  return res;
}

export function setupCORS(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token,X-Forwarded-Host,X-URL-Scheme,x-middleware-preflight,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version",
  );
}

export function parseQueryString(req: IncomingMessage): Record<string, any> {
  const url = new URL(req.url || "", "http://localhost");
  const params: Record<string, any> = {};

  for (const [key, value] of url.searchParams) {
    params[key] = value;
  }

  return params;
}
