// /lib/cors.js

// List of allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000', // Local dev
  'https://yourdomain.com', // Replace with your deployed frontend
];

export function withCORS(handler) {
  return async (req) => {
    const origin = req.headers.get('origin') || '*';
    const isAllowed = allowedOrigins.includes(origin);

    const res = await handler(req);

    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };

    const finalResponse = new Response(res.body, res);

    for (const [key, value] of Object.entries(corsHeaders)) {
      finalResponse.headers.set(key, value);
    }

    return finalResponse;
  };
}
