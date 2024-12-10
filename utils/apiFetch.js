import fetch from 'node-fetch';

export const apiFetch = async (path) => {
  return await fetch(`${process.env.API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
    }
  });
}
