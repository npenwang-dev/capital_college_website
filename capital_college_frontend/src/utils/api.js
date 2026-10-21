const BACKEND_PORT = 5001;
const DIRECT_BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

export async function apiFetch(endpoint, options = {}) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // In local development, direct call to port 5001 avoids Vite proxy inter-process socket latency
  const isLocalDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalDev) {
    try {
      const directUrl = `${DIRECT_BACKEND_URL}${path}`;
      const res = await fetch(directUrl, options);
      return res;
    } catch (err) {
      // Direct call failed, fall back to relative path
    }
  }

  // Fallback to relative path (Vite proxy or production reverse proxy)
  try {
    const res = await fetch(path, options);
    return res;
  } catch (err) {
    const directUrl = `${DIRECT_BACKEND_URL}${path}`;
    return await fetch(directUrl, options);
  }
}

