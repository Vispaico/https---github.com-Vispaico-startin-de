export function assertSecureServiceUrl(value: string) {
  let url: URL;
  try { url = new URL(value); } catch { throw new Error('provider_endpoint_invalid'); }
  const local = ['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && local && url.protocol === 'http:')) throw new Error('provider_endpoint_must_use_tls');
  if (url.username || url.password) throw new Error('provider_endpoint_invalid');
  return url;
}
