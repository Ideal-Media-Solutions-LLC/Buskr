import { createClient } from 'redis';

const { CACHE_URL: url, CACHE_TLS } = process.env;

const redis = createClient({
  socket: { tls: CACHE_TLS === 'true' || CACHE_TLS === '1' },
  url,
});

export default async function cache(key, func, EX) {
  const options = EX === undefined ? undefined : { EX };
  if (!redis.isOpen) {
    await redis.connect();
  }
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  const loaded = await func();
  await redis.set(key, JSON.stringify(loaded), options);
  return loaded;
}
