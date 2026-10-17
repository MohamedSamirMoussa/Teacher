import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>503 Service Unavailable</title>

        <style>
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #222222;
            font-family: Arial, Helvetica, sans-serif;
          }

          body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }

          .error {
            width: 100%;
            max-width: 620px;
          }

          h1 {
            margin: 0 0 20px;
            font-size: 32px;
            font-weight: 500;
          }

          p {
            margin: 8px 0;
            font-size: 16px;
            line-height: 1.7;
            color: #555;
          }

          hr {
            margin: 28px 0 18px;
            border: 0;
            border-top: 1px solid #ddd;
          }

          .server {
            font-size: 13px;
            color: #999;
          }
        </style>
      </head>

      <body>
        <div class="error">
          <h1>503 Service Temporarily Unavailable</h1>

          <p>
            The server is temporarily unable to service your request.
          </p>

          <p>
            Please try again later.
          </p>

          <hr />

          <div class="server">
            Server
          </div>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 503,

    headers: {
      "Content-Type": "text/html; charset=utf-8",

      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate",

      "Retry-After": "3600",
    },
  });
}

export const config = {
  matcher: "/:path*",
};