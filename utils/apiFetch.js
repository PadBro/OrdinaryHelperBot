import fetch from 'node-fetch';

export const apiFetch = async (path, options) => {
  const url = `${process.env.API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}?${new URLSearchParams(options.query)}`;
  return await fetch(url, {
    method: options.method,
    body: JSON.stringify(options.body),
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
};
