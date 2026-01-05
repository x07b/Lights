import { IncomingMessage, ServerResponse } from "http";

export interface ResponseWithMethods extends ServerResponse {
  json?: (data: any) => ResponseWithMethods;
  status?: (code: number) => ResponseWithMethods;
}

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

export function wrapResponse(res: ServerResponse): ResponseWithMethods {
  let statusCode = 200;

  (res as ResponseWithMethods).json = function (data: any) {
    this.setHeader("Content-Type", "application/json");
    this.statusCode = statusCode;
    this.end(JSON.stringify(data));
    return this;
  };

  (res as ResponseWithMethods).status = function (code: number) {
    statusCode = code;
    return this;
  };

  return res as ResponseWithMethods;
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
